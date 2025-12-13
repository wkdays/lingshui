const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'portal_secret_key_2024'

// 中间件
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// 确保uploads目录存在
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// 文件上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`)
  }
})
const upload = multer({ storage })

// 数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'portal_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10
})

// JWT验证中间件
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: '未授权' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Token无效' })
  }
}

// ==================== 认证接口 ====================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const [rows] = await pool.query('SELECT * FROM admins WHERE username = ?', [username])
    
    if (rows.length === 0) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }
    
    const admin = rows[0]
    const valid = await bcrypt.compare(password, admin.password)
    
    if (!valid) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }
    
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, username: admin.username })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})

// ==================== 通用CRUD生成器 ====================
const createCRUD = (tableName) => {
  const router = express.Router()

  // 列表查询
  router.get('/', async (req, res) => {
    try {
      const { page = 1, limit = 10, recommend } = req.query
      const offset = (page - 1) * limit
      
      let where = ''
      const params = []
      
      if (recommend !== undefined) {
        where = 'WHERE recommend = ?'
        params.push(Number(recommend))
      }
      
      const [countResult] = await pool.query(`SELECT COUNT(*) as total FROM ${tableName} ${where}`, params)
      const [rows] = await pool.query(
        `SELECT * FROM ${tableName} ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [...params, Number(limit), Number(offset)]
      )
      
      res.json({ data: rows, total: countResult[0].total, page: Number(page), limit: Number(limit) })
    } catch (error) {
      console.error(`Get ${tableName} list error:`, error)
      res.status(500).json({ error: '服务器错误' })
    }
  })

  // 详情查询
  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM ${tableName} WHERE id = ?`, [req.params.id])
      if (rows.length === 0) {
        return res.status(404).json({ error: '记录不存在' })
      }
      // 增加浏览次数
      await pool.query(`UPDATE ${tableName} SET views = views + 1 WHERE id = ?`, [req.params.id])
      res.json({ data: rows[0] })
    } catch (error) {
      console.error(`Get ${tableName} detail error:`, error)
      res.status(500).json({ error: '服务器错误' })
    }
  })

  // 创建
  router.post('/', authMiddleware, async (req, res) => {
    try {
      const { title, summary, content, cover, recommend = 0, progress } = req.body
      const fields = ['title', 'summary', 'content', 'cover', 'recommend']
      const values = [title, summary, content, cover, recommend]
      
      if (progress !== undefined) {
        fields.push('progress')
        values.push(progress)
      }
      
      const [result] = await pool.query(
        `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`,
        values
      )
      
      res.json({ id: result.insertId, message: '创建成功' })
    } catch (error) {
      console.error(`Create ${tableName} error:`, error)
      res.status(500).json({ error: '服务器错误' })
    }
  })

  // 更新
  router.put('/:id', authMiddleware, async (req, res) => {
    try {
      const { title, summary, content, cover, recommend, progress } = req.body
      const updates = []
      const values = []
      
      if (title !== undefined) { updates.push('title = ?'); values.push(title) }
      if (summary !== undefined) { updates.push('summary = ?'); values.push(summary) }
      if (content !== undefined) { updates.push('content = ?'); values.push(content) }
      if (cover !== undefined) { updates.push('cover = ?'); values.push(cover) }
      if (recommend !== undefined) { updates.push('recommend = ?'); values.push(recommend) }
      if (progress !== undefined) { updates.push('progress = ?'); values.push(progress) }
      
      if (updates.length === 0) {
        return res.status(400).json({ error: '没有要更新的字段' })
      }
      
      values.push(req.params.id)
      await pool.query(`UPDATE ${tableName} SET ${updates.join(', ')} WHERE id = ?`, values)
      
      res.json({ message: '更新成功' })
    } catch (error) {
      console.error(`Update ${tableName} error:`, error)
      res.status(500).json({ error: '服务器错误' })
    }
  })

  // 删除
  router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      await pool.query(`DELETE FROM ${tableName} WHERE id = ?`, [req.params.id])
      res.json({ message: '删除成功' })
    } catch (error) {
      console.error(`Delete ${tableName} error:`, error)
      res.status(500).json({ error: '服务器错误' })
    }
  })

  return router
}

// ==================== 轮播图接口 ====================
const carouselRouter = express.Router()

carouselRouter.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM carousel ORDER BY sort ASC')
    res.json({ data: rows })
  } catch (error) {
    console.error('Get carousel error:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})

carouselRouter.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, image, description, sort = 0 } = req.body
    const [result] = await pool.query(
      'INSERT INTO carousel (title, image, description, sort) VALUES (?, ?, ?, ?)',
      [title, image, description, sort]
    )
    res.json({ id: result.insertId, message: '创建成功' })
  } catch (error) {
    console.error('Create carousel error:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})

carouselRouter.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, image, description, sort } = req.body
    await pool.query(
      'UPDATE carousel SET title = ?, image = ?, description = ?, sort = ? WHERE id = ?',
      [title, image, description, sort, req.params.id]
    )
    res.json({ message: '更新成功' })
  } catch (error) {
    console.error('Update carousel error:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})

carouselRouter.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM carousel WHERE id = ?', [req.params.id])
    res.json({ message: '删除成功' })
  } catch (error) {
    console.error('Delete carousel error:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})

// ==================== 文件上传接口 ====================
app.post('/api/upload', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '没有上传文件' })
  }
  res.json({ url: `/uploads/${req.file.filename}` })
})

// ==================== 注册路由 ====================
app.use('/api/news', createCRUD('news'))
app.use('/api/bidding', createCRUD('bidding'))
app.use('/api/project', createCRUD('project'))
app.use('/api/party', createCRUD('party'))
app.use('/api/carousel', carouselRouter)

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
