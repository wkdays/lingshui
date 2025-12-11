const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const path = require('path')
const multer = require('multer')
const fs = require('fs')
const db = require('./db')

const app = express()
const PORT = 8080
const JWT_SECRET = 'zonglian_secret_key_2025'  // 生产环境应使用环境变量
const SERVER_URL = 'http://localhost:8080'  // 服务器地址，用于拼接图片URL

// 确保上传目录存在
const uploadDir = path.join(__dirname, 'public', 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `banner_${Date.now()}${ext}`)
  }
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// 管理后台入口
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'))
})

// 图片上传接口
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.json({ code: 400, message: '请选择图片' })
  }
  const imageUrl = `/uploads/${req.file.filename}`
  res.json({ code: 0, data: { url: imageUrl } })
})

// Token验证中间件
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.json({ code: 401, message: '未登录' })
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.json({ code: 401, message: 'Token无效或已过期' })
  }
}

// ==================== 用户认证接口（统一账号体系） ====================

// 生成头像URL（使用本地默认头像）
const getAvatarUrl = (nickname) => {
  return SERVER_URL + '/avatar-default.png'
}

// 补全图片URL（相对路径转完整URL）
const fullImageUrl = (url) => {
  if (!url) return ''
  return url.startsWith('http') ? url : SERVER_URL + url
}

// 登录
app.post('/api/auth/login', async (req, res) => {
  try {
    const { phone, password } = req.body
    if (!phone || !password) {
      return res.json({ code: 400, message: '请输入手机号和密码' })
    }
    const [rows] = await db.query('SELECT * FROM users WHERE phone = ?', [phone])
    if (rows.length === 0) {
      return res.json({ code: 404, message: '用户不存在' })
    }
    const user = rows[0]
    if (user.password !== password) {
      return res.json({ code: 401, message: '密码错误' })
    }
    if (user.status !== 'active') {
      return res.json({ code: 403, message: '账号已被禁用' })
    }
    // 生成Token（7天有效）
    const token = jwt.sign(
      { id: user.id, phone: user.phone, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.json({
      code: 0,
      data: {
        token,
        user: {
          id: user.id,
          phone: user.phone,
          nickname: user.nickname,
          avatar: fullImageUrl(user.avatar) || getAvatarUrl(user.nickname),
          role: user.role,
          balance: parseFloat(user.balance),
          points: user.points,
          level: user.level
        }
      }
    })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// 注册
app.post('/api/auth/register', async (req, res) => {
  try {
    const { phone, password, nickname } = req.body
    if (!phone || !password) {
      return res.json({ code: 400, message: '请输入手机号和密码' })
    }
    // 检查手机号是否已注册
    const [existing] = await db.query('SELECT id FROM users WHERE phone = ?', [phone])
    if (existing.length > 0) {
      return res.json({ code: 409, message: '手机号已注册' })
    }
    const id = 'u_' + Date.now()
    await db.query(
      'INSERT INTO users (id, phone, password, nickname) VALUES (?, ?, ?, ?)',
      [id, phone, password, nickname || '新用户']
    )
    // 自动登录，返回Token
    const token = jwt.sign(
      { id, phone, role: '普通用户' },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.json({
      code: 0,
      data: {
        token,
        user: { id, phone, nickname: nickname || '新用户', role: '普通用户', balance: 0, points: 0 }
      }
    })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// 验证Token（其他小程序调用，实现SSO）
app.get('/api/auth/verify', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id])
    if (rows.length === 0) {
      return res.json({ code: 404, message: '用户不存在' })
    }
    const user = rows[0]
    res.json({
      code: 0,
      data: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        avatar: fullImageUrl(user.avatar) || getAvatarUrl(user.nickname),
        role: user.role,
        balance: parseFloat(user.balance),
        points: user.points,
        level: user.level
      }
    })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// 获取当前用户信息
app.get('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id])
    if (rows.length === 0) {
      return res.json({ code: 404, message: '用户不存在' })
    }
    const user = rows[0]
    
    // 获取用户的接单统计
    const [orderStats] = await db.query(`
      SELECT 
        COUNT(*) as receivedCount,
        COUNT(*) as finishedCount
      FROM task_orders WHERE user_id = ?
    `, [req.user.id])
    
    // 统计用户发布的任务数
    const [publishStats] = await db.query(`
      SELECT COUNT(*) as publishedCount FROM tasks WHERE publisher_id = ?
    `, [req.user.id])
    const publishedCount = publishStats[0]?.publishedCount || 0
    
    res.json({
      code: 0,
      data: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        avatar: fullImageUrl(user.avatar) || getAvatarUrl(user.nickname),
        role: user.role,
        balance: parseFloat(user.balance),
        points: user.points,
        level: user.level,
        receivedCount: orderStats[0]?.receivedCount || 0,
        finishedCount: orderStats[0]?.finishedCount || 0,
        publishedCount: publishedCount
      }
    })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// ==================== 轮播图接口 ====================

// 获取所有轮播图
app.get('/api/banners', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM banners ORDER BY created_at DESC')
    const data = rows.map(r => ({
      id: r.id,
      title: r.title,
      desc: r.desc,
      imageUrl: fullImageUrl(r.image_url),
      gradient: r.gradient ? JSON.parse(r.gradient) : ['#3a7bff', '#3a9dff'],
      link: r.link || '',
      status: r.status,
      createdAt: r.created_at
    }))
    res.json({ code: 0, data })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// 创建轮播图
app.post('/api/banners', async (req, res) => {
  try {
    const id = 'b_' + Date.now()
    const { title, desc, imageUrl, gradient, link, status } = req.body
    await db.query(
      'INSERT INTO banners (id, title, `desc`, image_url, gradient, link, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, title, desc || '', imageUrl || '', JSON.stringify(gradient || ['#3a7bff', '#3a9dff']), link || '', status || 'published']
    )
    res.json({ code: 0, data: { id, ...req.body } })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// 更新轮播图
app.put('/api/banners/:id', async (req, res) => {
  try {
    const { title, desc, imageUrl, gradient, link, status } = req.body
    const [result] = await db.query(
      'UPDATE banners SET title=?, `desc`=?, image_url=?, gradient=?, link=?, status=? WHERE id=?',
      [title, desc || '', imageUrl || '', JSON.stringify(gradient || []), link || '', status || 'published', req.params.id]
    )
    if (result.affectedRows === 0) {
      return res.json({ code: 404, message: '轮播图不存在' })
    }
    res.json({ code: 0, data: { id: req.params.id, ...req.body } })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// 删除轮播图
app.delete('/api/banners/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM banners WHERE id=?', [req.params.id])
    if (result.affectedRows === 0) {
      return res.json({ code: 404, message: '轮播图不存在' })
    }
    res.json({ code: 0, message: '删除成功' })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// ==================== 公告接口 ====================

// 获取所有公告
app.get('/api/announcements', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM announcements ORDER BY created_at DESC')
    const data = rows.map(r => ({
      id: r.id,
      title: r.title,
      content: r.content,
      status: r.status,
      time: r.created_at ? r.created_at.toISOString().slice(0, 10) : ''
    }))
    res.json({ code: 0, data })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// 创建公告
app.post('/api/announcements', async (req, res) => {
  try {
    const id = 'a_' + Date.now()
    const { title, content, status } = req.body
    await db.query(
      'INSERT INTO announcements (id, title, content, status) VALUES (?, ?, ?, ?)',
      [id, title, content || '', status || 'draft']
    )
    res.json({ code: 0, data: { id, ...req.body, time: new Date().toISOString().slice(0, 10) } })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// 更新公告
app.put('/api/announcements/:id', async (req, res) => {
  try {
    const { title, content, status } = req.body
    const [result] = await db.query(
      'UPDATE announcements SET title=?, content=?, status=? WHERE id=?',
      [title, content || '', status, req.params.id]
    )
    if (result.affectedRows === 0) {
      return res.json({ code: 404, message: '公告不存在' })
    }
    res.json({ code: 0, data: { id: req.params.id, ...req.body } })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// 删除公告
app.delete('/api/announcements/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM announcements WHERE id=?', [req.params.id])
    if (result.affectedRows === 0) {
      return res.json({ code: 404, message: '公告不存在' })
    }
    res.json({ code: 0, message: '删除成功' })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// 切换公告状态（发布/下线）
app.patch('/api/announcements/:id/status', async (req, res) => {
  try {
    const [result] = await db.query('UPDATE announcements SET status=? WHERE id=?', [req.body.status, req.params.id])
    if (result.affectedRows === 0) {
      return res.json({ code: 404, message: '公告不存在' })
    }
    res.json({ code: 0, data: { id: req.params.id, status: req.body.status } })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// ==================== 任务接口 ====================

// 获取所有任务
app.get('/api/tasks', async (req, res) => {
  try {
    const { type, status } = req.query
    let sql = 'SELECT * FROM tasks WHERE 1=1'
    const params = []
    if (type) {
      sql += ' AND type = ?'
      params.push(type)
    }
    if (status) {
      sql += ' AND status = ?'
      params.push(status)
    }
    sql += ' ORDER BY created_at DESC'
    const [rows] = await db.query(sql, params)
    const data = rows.map(r => ({
      id: r.id,
      title: r.title,
      desc: r.description,
      price: parseFloat(r.price),
      unit: r.unit,
      type: r.type,
      location: r.location,
      tag: r.tag,
      peopleNeeded: r.people_needed,
      publisher: r.publisher,
      status: r.status,
      date: r.work_date || '',
      period: r.work_period || '',
      createdAt: r.created_at
    }))
    res.json({ code: 0, data })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// 获取我发布的任务列表
app.get('/api/tasks/my-published', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, 
        (SELECT COUNT(*) FROM task_orders WHERE task_id = t.id) as order_count
      FROM tasks t 
      WHERE t.publisher_id = ? 
      ORDER BY t.created_at DESC
    `, [req.user.id])
    
    const data = rows.map(r => ({
      id: r.id,
      title: r.title,
      type: r.type === 'daily' ? '日结单' : '赏金单',
      received: r.order_count || 0,
      total: r.people_needed,
      status: r.status === 'open' ? '招募中' : '已结束'
    }))
    res.json({ code: 0, data })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// 获取任务详情
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id])
    if (rows.length === 0) {
      return res.json({ code: 404, message: '任务不存在' })
    }
    const r = rows[0]
    const data = {
      id: r.id,
      title: r.title,
      desc: r.description,
      price: parseFloat(r.price),
      unit: r.unit,
      type: r.type,
      location: r.location,
      tag: r.tag,
      peopleNeeded: r.people_needed,
      publisher: r.publisher,
      status: r.status,
      date: r.work_date || '',
      period: r.work_period || '',
      createdAt: r.created_at
    }
    res.json({ code: 0, data })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// 创建任务
app.post('/api/tasks', async (req, res) => {
  try {
    const id = 't_' + Date.now()
    const { title, desc, price, unit, type, location, tag, peopleNeeded, publisher, publisherId, status, date, period } = req.body
    await db.query(
      `INSERT INTO tasks (id, title, description, price, unit, type, location, tag, people_needed, publisher, publisher_id, status, work_date, work_period) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, desc || '', price || 0, unit || '元/单', type || 'daily', location || '线上', tag || '', peopleNeeded || 10, publisher || '平台发布', publisherId || null, status || 'open', date || '', period || '']
    )
    res.json({ code: 0, data: { id, ...req.body } })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// 更新任务
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { title, desc, price, unit, type, location, tag, peopleNeeded, publisher, status, date, period } = req.body
    const [result] = await db.query(
      `UPDATE tasks SET title=?, description=?, price=?, unit=?, type=?, location=?, tag=?, people_needed=?, publisher=?, status=?, work_date=?, work_period=? WHERE id=?`,
      [title, desc || '', price || 0, unit || '元/单', type || 'daily', location || '线上', tag || '', peopleNeeded || 10, publisher || '', status || 'open', date || '', period || '', req.params.id]
    )
    if (result.affectedRows === 0) {
      return res.json({ code: 404, message: '任务不存在' })
    }
    res.json({ code: 0, data: { id: req.params.id, ...req.body } })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// 删除任务
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM tasks WHERE id=?', [req.params.id])
    if (result.affectedRows === 0) {
      return res.json({ code: 404, message: '任务不存在' })
    }
    res.json({ code: 0, message: '删除成功' })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// 切换任务状态
app.patch('/api/tasks/:id/status', async (req, res) => {
  try {
    const [result] = await db.query('UPDATE tasks SET status=? WHERE id=?', [req.body.status, req.params.id])
    if (result.affectedRows === 0) {
      return res.json({ code: 404, message: '任务不存在' })
    }
    res.json({ code: 0, data: { id: req.params.id, status: req.body.status } })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// ==================== 任务订单/接单管理接口 ====================

// 获取任务的接单统计（我发的单管理）
app.get('/api/tasks/published/stats', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, 
        COUNT(o.id) as order_count,
        SUM(CASE WHEN o.status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN o.status = 'submitted' THEN 1 ELSE 0 END) as submitted_count,
        SUM(CASE WHEN o.status = 'approved' THEN 1 ELSE 0 END) as approved_count,
        SUM(CASE WHEN o.status = 'rejected' THEN 1 ELSE 0 END) as rejected_count
      FROM tasks t
      LEFT JOIN task_orders o ON t.id = o.task_id
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `)
    const data = rows.map(r => ({
      id: r.id,
      title: r.title,
      type: r.type,
      price: parseFloat(r.price),
      unit: r.unit,
      peopleNeeded: r.people_needed,
      status: r.status,
      orderCount: r.order_count || 0,
      pendingCount: r.pending_count || 0,
      submittedCount: r.submitted_count || 0,
      approvedCount: r.approved_count || 0,
      rejectedCount: r.rejected_count || 0
    }))
    res.json({ code: 0, data })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// 获取某个任务的所有接单详情
app.get('/api/tasks/:taskId/orders', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.*, t.title as task_title 
      FROM task_orders o 
      LEFT JOIN tasks t ON o.task_id = t.id
      WHERE o.task_id = ?
      ORDER BY o.created_at DESC
    `, [req.params.taskId])
    const data = rows.map(r => ({
      id: r.id,
      taskId: r.task_id,
      taskTitle: r.task_title,
      userId: r.user_id,
      userName: r.user_name,
      status: r.status,
      submitInfo: r.submit_info,
      submitTime: r.submit_time,
      reviewTime: r.review_time,
      createdAt: r.created_at
    }))
    res.json({ code: 0, data })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// 用户提交完成
app.patch('/api/orders/:id/submit', authMiddleware, async (req, res) => {
  try {
    const { submitInfo } = req.body
    const [result] = await db.query(
      'UPDATE task_orders SET status="submitted", submit_info=?, submit_time=NOW() WHERE id=? AND user_id=?',
      [submitInfo || '', req.params.id, req.user.id]
    )
    if (result.affectedRows === 0) {
      return res.json({ code: 404, message: '订单不存在或无权操作' })
    }
    res.json({ code: 0, message: '提交成功，等待审核' })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// 审核接单（通过/拒绝）
app.patch('/api/orders/:id/review', async (req, res) => {
  try {
    const { status } = req.body // approved 或 rejected
    const [result] = await db.query(
      'UPDATE task_orders SET status=?, review_time=NOW() WHERE id=?',
      [status, req.params.id]
    )
    if (result.affectedRows === 0) {
      return res.json({ code: 404, message: '订单不存在' })
    }
    res.json({ code: 0, data: { id: req.params.id, status } })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// 获取我的接单列表
app.get('/api/orders/my', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id
    const [rows] = await db.query(`
      SELECT o.*, t.title as task_title, t.price, t.unit, t.work_date, t.work_period
      FROM task_orders o 
      LEFT JOIN tasks t ON o.task_id = t.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [userId])
    const data = rows.map(r => ({
      id: r.id,
      taskId: r.task_id,
      taskTitle: r.task_title,
      price: parseFloat(r.price),
      unit: r.unit,
      status: r.status,
      submitInfo: r.submit_info,
      submitTime: r.submit_time,
      reviewTime: r.review_time,
      deadline: r.work_date || '待定',
      period: r.work_period,
      createdAt: r.created_at
    }))
    res.json({ code: 0, data })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// 用户接单
app.post('/api/tasks/:id/accept', authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id
    const userId = req.user.id
    
    // 检查任务是否存在且开放
    const [tasks] = await db.query('SELECT * FROM tasks WHERE id = ?', [taskId])
    if (tasks.length === 0) {
      return res.json({ code: 404, message: '任务不存在' })
    }
    const task = tasks[0]
    if (task.status !== 'open') {
      return res.json({ code: 400, message: '任务已关闭，无法接单' })
    }
    
    // 检查是否已接过此任务
    const [existing] = await db.query(
      'SELECT id FROM task_orders WHERE task_id = ? AND user_id = ?',
      [taskId, userId]
    )
    if (existing.length > 0) {
      return res.json({ code: 400, message: '您已接过此任务' })
    }
    
    // 检查接单人数是否已满
    const [orderCount] = await db.query(
      'SELECT COUNT(*) as count FROM task_orders WHERE task_id = ?',
      [taskId]
    )
    if (orderCount[0].count >= task.people_needed) {
      return res.json({ code: 400, message: '任务接单人数已满' })
    }
    
    // 获取用户信息
    const [users] = await db.query('SELECT nickname FROM users WHERE id = ?', [userId])
    const userName = users.length > 0 ? users[0].nickname : '未知用户'
    
    // 创建接单记录
    const orderId = 'o_' + Date.now()
    await db.query(
      'INSERT INTO task_orders (id, task_id, user_id, user_name, status) VALUES (?, ?, ?, ?, ?)',
      [orderId, taskId, userId, userName, 'pending']
    )
    
    res.json({
      code: 0,
      message: '接单成功',
      data: {
        orderId,
        taskId,
        taskTitle: task.title,
        status: 'pending'
      }
    })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// 结束任务（关闭接单）
app.patch('/api/tasks/:id/close', async (req, res) => {
  try {
    const [result] = await db.query('UPDATE tasks SET status="closed" WHERE id=?', [req.params.id])
    if (result.affectedRows === 0) {
      return res.json({ code: 404, message: '任务不存在' })
    }
    res.json({ code: 0, message: '任务已结束' })
  } catch (err) {
    res.json({ code: 500, message: err.message })
  }
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n🚀 总链管理端API已启动`)
  console.log(`   地址: http://localhost:${PORT}`)
  console.log(`\n认证接口（统一账号体系）:`)
  console.log(`   POST   /api/auth/login      - 登录`)
  console.log(`   POST   /api/auth/register   - 注册`)
  console.log(`   GET    /api/auth/verify     - 验证Token（SSO）`)
  console.log(`   GET    /api/user/profile    - 获取用户信息`)
  console.log(`\n管理接口:`)
  console.log(`   轮播图: GET/POST /api/banners, PUT/DELETE /api/banners/:id`)
  console.log(`   公告:   GET/POST /api/announcements, PUT/DELETE /api/announcements/:id`)
  console.log(`   任务:   GET/POST /api/tasks, PUT/DELETE /api/tasks/:id`)
  console.log(`\n测试账号:`)
  console.log(`   管理员: 13800138000 / 123456`)
  console.log(`   普通用户: 13800138001 / 123456\n`)
})
