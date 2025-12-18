/**
 * 团餐管理系统后台 - Node.js + Express + sql.js
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');
const printer = require('./printer');

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// 映射小程序的静态资源目录，使管理端可以显示图片
app.use('/static', express.static(path.join(__dirname, '..', 'static')));

// 管理员账号配置
const ADMIN_PHONE = '13800138000';
const ADMIN_PASSWORD = '123456';

// 简单的token存储（生产环境应使用Redis等）
const tokens = new Set();

// 生成token
function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// 验证token中间件
function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (!token || !tokens.has(token)) {
    return res.status(401).json({ code: 401, msg: '请先登录' });
  }
  next();
}

// 数据库文件路径
const DB_PATH = path.join(__dirname, 'tuancan.db');

// 数据库实例
let db = null;

// 保存数据库到文件
function saveDatabase() {
  if (db) {
    try {
      const data = db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(DB_PATH, buffer);
    } catch (e) {
      console.error('[DB] saveDatabase failed:', e);
      throw e;
    }
  }
}

function normalizeSqlParam(p) {
  if (p === undefined) return null;
  if (typeof p === 'number' && Number.isNaN(p)) return null;
  return p;
}

// 辅助函数：执行查询返回所有结果
function dbAll(sql, params = []) {
  const stmt = db.prepare(sql);
  const safeParams = params.map(normalizeSqlParam);
  if (safeParams.length > 0) stmt.bind(safeParams);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

// 辅助函数：执行查询返回单个结果
function dbGet(sql, params = []) {
  const results = dbAll(sql, params);
  return results.length > 0 ? results[0] : null;
}

// 辅助函数：执行更新/插入
function dbRun(sql, params = []) {
  const safeParams = params.map(normalizeSqlParam);
  try {
    db.run(sql, safeParams);
    saveDatabase();
  } catch (e) {
    console.error('[DB] dbRun failed:', { sql, params: safeParams, error: e });
    throw e;
  }
  return { lastInsertRowid: db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] || 0 };
}

// 初始化数据库
async function initDatabase() {
  const SQL = await initSqlJs();
  
  // 如果数据库文件存在则加载，否则创建新的
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // 创建表
  db.run(`
    CREATE TABLE IF NOT EXISTS tc_dishes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      image TEXT,
      price REAL NOT NULL,
      original_price REAL,
      category_id INTEGER,
      description TEXT,
      unit TEXT DEFAULT '份',
      stock INTEGER DEFAULT 100,
      sales INTEGER DEFAULT 0,
      is_special INTEGER DEFAULT 0,
      meal_time TEXT DEFAULT 'lunch',
      status INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tc_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sort INTEGER DEFAULT 0,
      status INTEGER DEFAULT 1
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tc_banners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image TEXT NOT NULL,
      title TEXT,
      subtitle TEXT,
      link TEXT,
      sort INTEGER DEFAULT 0,
      status INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tc_notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      type TEXT DEFAULT 'notice',
      status INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 插入默认分类
  const categoryCount = dbGet('SELECT COUNT(*) as count FROM tc_categories');
  if (categoryCount.count === 0) {
    db.run("INSERT INTO tc_categories (name, sort) VALUES ('全部', 0)");
    db.run("INSERT INTO tc_categories (name, sort) VALUES ('早餐', 1)");
    db.run("INSERT INTO tc_categories (name, sort) VALUES ('午餐', 2)");
    db.run("INSERT INTO tc_categories (name, sort) VALUES ('晚餐', 3)");
    db.run("INSERT INTO tc_categories (name, sort) VALUES ('下午茶', 4)");
    db.run("INSERT INTO tc_categories (name, sort) VALUES ('特价', 5)");
  }

  // 插入默认菜品数据
  const dishCount = dbGet('SELECT COUNT(*) as count FROM tc_dishes');
  if (dishCount.count === 0) {
    const defaultDishes = [
      { name: '营养早餐套餐', image: '/static/images/food1.png', price: 8, original_price: 10, category_id: 2, description: '白粥+馒头+鸡蛋+小菜', unit: '份', stock: 100, is_special: 0, meal_time: 'breakfast', status: 1 },
      { name: '豆浆油条套餐', image: '/static/images/food2.png', price: 6, original_price: 8, category_id: 2, description: '现磨豆浆+金黄油条', unit: '份', stock: 100, is_special: 1, meal_time: 'breakfast', status: 1 },
      { name: '蛋炒饭套餐', image: '/static/images/food3.png', price: 10, original_price: 12, category_id: 2, description: '鸡蛋炒饭+紫菜汤', unit: '份', stock: 100, is_special: 1, meal_time: 'breakfast', status: 1 },
      { name: '红烧肉套餐', image: '/static/images/food4.png', price: 18, original_price: 22, category_id: 3, description: '红烧肉+时蔬+米饭+汤', unit: '份', stock: 50, is_special: 0, meal_time: 'lunch', status: 1 },
      { name: '糖醋排骨套餐', image: '/static/images/food5.png', price: 20, original_price: 25, category_id: 3, description: '糖醋排骨+青菜+米饭', unit: '份', stock: 50, is_special: 1, meal_time: 'lunch', status: 1 },
      { name: '宫保鸡丁套餐', image: '/static/images/food6.png', price: 16, original_price: 18, category_id: 3, description: '宫保鸡丁+配菜+米饭', unit: '份', stock: 50, is_special: 0, meal_time: 'lunch', status: 1 },
      { name: '番茄牛腩套餐', image: '/static/images/food7.png', price: 22, original_price: 28, category_id: 3, description: '番茄牛腩+米饭+例汤', unit: '份', stock: 30, is_special: 1, meal_time: 'lunch', status: 1 },
      { name: '清淡晚餐套餐', image: '/static/images/food8.png', price: 15, original_price: 18, category_id: 4, description: '蒜蓉西兰花+蛋花汤+米饭', unit: '份', stock: 50, is_special: 0, meal_time: 'dinner', status: 1 },
      { name: '营养晚餐套餐', image: '/static/images/food1.png', price: 18, original_price: 22, category_id: 4, description: '清蒸鱼+时蔬+米饭', unit: '份', stock: 50, is_special: 0, meal_time: 'dinner', status: 1 },
      { name: '素食套餐', image: '/static/images/food2.png', price: 12, original_price: 15, category_id: 4, description: '三鲜豆腐+炒青菜+米饭', unit: '份', stock: 80, is_special: 1, meal_time: 'dinner', status: 1 },
      { name: '香米饭套餐', image: '/static/images/food1.png', price: 12, original_price: 15, category_id: 3, description: '香喷喷的白米饭配菜', unit: '份', stock: 50, is_special: 1, meal_time: 'lunch', status: 1 },
      { name: '咖喱炒饭', image: '/static/images/food2.png', price: 25, original_price: 25, category_id: 3, description: '香浓咖喱，米饭Q弹', unit: '份', stock: 30, is_special: 0, meal_time: 'lunch', status: 1 },
      { name: '海鲜炒饭', image: '/static/images/food6.png', price: 38, original_price: 45, category_id: 4, description: '鲜美海鲜配饭', unit: '份', stock: 20, is_special: 1, meal_time: 'dinner', status: 1 },
      { name: '咖喱鸡肉饭', image: '/static/images/food7.png', price: 18, original_price: 18, category_id: 3, description: '浓郁咖喱鸡', unit: '份', stock: 45, is_special: 0, meal_time: 'lunch', status: 1 },
      { name: '什锦炒饭', image: '/static/images/food8.png', price: 8, original_price: 10, category_id: 3, description: '多种配料', unit: '份', stock: 120, is_special: 1, meal_time: 'lunch', status: 1 }
    ];
    defaultDishes.forEach(d => {
      db.run(`INSERT INTO tc_dishes (name, image, price, original_price, category_id, description, unit, stock, is_special, meal_time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [d.name, d.image, d.price, d.original_price, d.category_id, d.description, d.unit, d.stock, d.is_special, d.meal_time, d.status]);
    });
  }

  // 插入默认轮播图数据
  const bannerCount = dbGet('SELECT COUNT(*) as count FROM tc_banners');
  if (bannerCount.count === 0) {
    const defaultBanners = [
      { image: '/static/images/banner1.png', title: '机关食堂', subtitle: '营养配餐', link: '', sort: 0, status: 1 },
      { image: '/static/images/banner2.png', title: '职工福利', subtitle: '团餐优惠', link: '/pages/special/special', sort: 1, status: 1 },
      { image: '/static/images/banner3.png', title: '便民服务', subtitle: '在线订餐', link: '/pages/shop/list', sort: 2, status: 1 }
    ];
    defaultBanners.forEach(b => {
      db.run('INSERT INTO tc_banners (image, title, subtitle, link, sort, status) VALUES (?, ?, ?, ?, ?, ?)',
        [b.image, b.title, b.subtitle, b.link, b.sort, b.status]);
    });
  }

  // 插入默认公告数据
  const noticeCount = dbGet('SELECT COUNT(*) as count FROM tc_notices');
  if (noticeCount.count === 0) {
    const defaultNotices = [
      { title: '【食堂通知】本周菜单已更新，欢迎预订', content: '本周食堂新增多款营养套餐，包含：红烧肉套餐、清蒸鱼套餐、素食套餐等，欢迎各位职工通过小程序提前预订。预订时间：每日8:00-17:00。', type: 'notice', status: 1 },
      { title: '【充值优惠】储值卡充值满500送50', content: '即日起至1月31日，虚拟储值卡充值满500元赠送50元，充值金额可在四个小程序中共享使用。充值方式：我的-余额-充值。', type: 'activity', status: 1 },
      { title: '【配送调整】春节期间食堂营业时间通知', content: '春节期间（1月20日-1月27日）食堂暂停堂食服务，仅支持预订自取。自取时间：11:00-13:00，17:00-18:30。请各位职工提前做好用餐安排。', type: 'notice', status: 1 },
      { title: '【系统公告】小程序功能升级完成', content: '团餐订购小程序已完成升级，新增功能：1.支持按周预订餐次；2.储值卡余额四小程序共享；3.订单状态实时推送。如有问题请联系后勤服务中心。', type: 'system', status: 1 }
    ];
    defaultNotices.forEach(n => {
      db.run('INSERT INTO tc_notices (title, content, type, status) VALUES (?, ?, ?, ?)',
        [n.title, n.content, n.type, n.status]);
    });
  }

  saveDatabase();
}

// ============ 登录 API ============

// 登录
app.post('/api/login', (req, res) => {
  const { phone, password } = req.body;
  if (phone === ADMIN_PHONE && password === ADMIN_PASSWORD) {
    const token = generateToken();
    tokens.add(token);
    res.json({ code: 0, data: { token, phone }, msg: '登录成功' });
  } else {
    res.json({ code: -1, msg: '手机号或密码错误' });
  }
});

// 登出
app.post('/api/logout', (req, res) => {
  const token = req.headers['authorization'];
  if (token) {
    tokens.delete(token);
  }
  res.json({ code: 0, msg: '已退出登录' });
});

// 验证登录状态
app.get('/api/check-auth', (req, res) => {
  const token = req.headers['authorization'];
  if (token && tokens.has(token)) {
    res.json({ code: 0, data: { phone: ADMIN_PHONE }, msg: 'success' });
  } else {
    res.json({ code: 401, msg: '未登录' });
  }
});

// ============ 菜品管理 API ============

// 获取菜品列表
app.get('/api/dishes', (req, res) => {
  const { category_id, status, keyword } = req.query;
  let sql = 'SELECT * FROM tc_dishes WHERE 1=1';
  const params = [];
  
  if (category_id) {
    sql += ' AND category_id = ?';
    params.push(category_id);
  }
  if (status !== undefined) {
    sql += ' AND status = ?';
    params.push(status);
  }
  if (keyword) {
    sql += ' AND name LIKE ?';
    params.push(`%${keyword}%`);
  }
  sql += ' ORDER BY id DESC';
  
  const dishes = dbAll(sql, params);
  res.json({ code: 0, data: dishes, msg: 'success' });
});

// 获取菜品详情
app.get('/api/dishes/:id', (req, res) => {
  const dish = dbGet('SELECT * FROM tc_dishes WHERE id = ?', [req.params.id]);
  res.json({ code: 0, data: dish, msg: 'success' });
});

// 新增菜品
app.post('/api/dishes', (req, res) => {
  const { name, image, price, original_price, category_id, description, unit, stock, is_special, meal_time, status } = req.body;
  const result = dbRun(`
    INSERT INTO tc_dishes (name, image, price, original_price, category_id, description, unit, stock, is_special, meal_time, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [name, image, price, original_price || price, category_id, description, unit || '份', stock || 100, is_special || 0, meal_time || 'lunch', status || 1]);
  res.json({ code: 0, data: { id: result.lastInsertRowid }, msg: '添加成功' });
});

// 更新菜品
app.put('/api/dishes/:id', (req, res) => {
  const { name, image, price, original_price, category_id, description, unit, stock, is_special, meal_time, status } = req.body;
  dbRun(`
    UPDATE tc_dishes SET name=?, image=?, price=?, original_price=?, category_id=?, description=?, unit=?, stock=?, is_special=?, meal_time=?, status=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `, [name, image, price, original_price, category_id, description, unit, stock, is_special, meal_time, status, req.params.id]);
  res.json({ code: 0, msg: '更新成功' });
});

// 删除菜品
app.delete('/api/dishes/:id', (req, res) => {
  dbRun('DELETE FROM tc_dishes WHERE id = ?', [req.params.id]);
  res.json({ code: 0, msg: '删除成功' });
});

// 上下架菜品
app.put('/api/dishes/:id/status', (req, res) => {
  const { status } = req.body;
  dbRun('UPDATE tc_dishes SET status = ? WHERE id = ?', [status, req.params.id]);
  res.json({ code: 0, msg: status === 1 ? '已上架' : '已下架' });
});

// ============ 分类管理 API ============

app.get('/api/categories', (req, res) => {
  const categories = dbAll('SELECT * FROM tc_categories ORDER BY sort');
  res.json({ code: 0, data: categories, msg: 'success' });
});

app.post('/api/categories', (req, res) => {
  const { name, sort } = req.body;
  const result = dbRun('INSERT INTO tc_categories (name, sort) VALUES (?, ?)', [name, sort || 0]);
  res.json({ code: 0, data: { id: result.lastInsertRowid }, msg: '添加成功' });
});

app.put('/api/categories/:id', (req, res) => {
  const { name, sort, status } = req.body;
  dbRun('UPDATE tc_categories SET name=?, sort=?, status=? WHERE id=?', [name, sort, status, req.params.id]);
  res.json({ code: 0, msg: '更新成功' });
});

app.delete('/api/categories/:id', (req, res) => {
  dbRun('DELETE FROM tc_categories WHERE id = ?', [req.params.id]);
  res.json({ code: 0, msg: '删除成功' });
});

// ============ 轮播图管理 API ============

app.get('/api/banners', (req, res) => {
  const banners = dbAll('SELECT * FROM tc_banners ORDER BY sort, id DESC');
  res.json({ code: 0, data: banners, msg: 'success' });
});

app.post('/api/banners', (req, res) => {
  const { image, title, subtitle, link, sort, status } = req.body;
  const result = dbRun('INSERT INTO tc_banners (image, title, subtitle, link, sort, status) VALUES (?, ?, ?, ?, ?, ?)',
    [image, title, subtitle, link, sort || 0, status || 1]);
  res.json({ code: 0, data: { id: result.lastInsertRowid }, msg: '添加成功' });
});

app.put('/api/banners/:id', (req, res) => {
  const { image, title, subtitle, link, sort, status } = req.body;
  dbRun('UPDATE tc_banners SET image=?, title=?, subtitle=?, link=?, sort=?, status=? WHERE id=?',
    [image, title, subtitle, link, sort, status, req.params.id]);
  res.json({ code: 0, msg: '更新成功' });
});

app.delete('/api/banners/:id', (req, res) => {
  dbRun('DELETE FROM tc_banners WHERE id = ?', [req.params.id]);
  res.json({ code: 0, msg: '删除成功' });
});

// ============ 公告管理 API ============

app.get('/api/notices', (req, res) => {
  const { status } = req.query;
  let sql = 'SELECT * FROM tc_notices';
  const params = [];
  if (status !== undefined) {
    sql += ' WHERE status = ?';
    params.push(status);
  }
  sql += ' ORDER BY id DESC';
  const notices = dbAll(sql, params);
  res.json({ code: 0, data: notices, msg: 'success' });
});

app.post('/api/notices', (req, res) => {
  const { title, content, type, status } = req.body;
  const result = dbRun('INSERT INTO tc_notices (title, content, type, status) VALUES (?, ?, ?, ?)',
    [title, content, type || 'notice', status || 1]);
  res.json({ code: 0, data: { id: result.lastInsertRowid }, msg: '添加成功' });
});

app.put('/api/notices/:id', (req, res) => {
  const { title, content, type, status } = req.body;
  dbRun('UPDATE tc_notices SET title=?, content=?, type=?, status=? WHERE id=?',
    [title, content, type, status, req.params.id]);
  res.json({ code: 0, msg: '更新成功' });
});

app.delete('/api/notices/:id', (req, res) => {
  dbRun('DELETE FROM tc_notices WHERE id = ?', [req.params.id]);
  res.json({ code: 0, msg: '删除成功' });
});

// 发布/下线公告
app.put('/api/notices/:id/status', (req, res) => {
  const { status } = req.body;
  dbRun('UPDATE tc_notices SET status = ? WHERE id = ?', [status, req.params.id]);
  res.json({ code: 0, msg: status === 1 ? '已发布' : '已下线' });
});

// ============ 小程序端 API（只返回上架/发布的数据） ============

// 获取轮播图（小程序用）
app.get('/api/mp/banners', (req, res) => {
  const banners = dbAll('SELECT * FROM tc_banners WHERE status = 1 ORDER BY sort, id DESC');
  const data = banners.map(b => ({
    id: b.id,
    image: b.image,
    title1: b.title,
    title2: b.subtitle,
    sub: b.subtitle,
    link: b.link || ''
  }));
  res.json({ code: 0, data, msg: 'success' });
});

// 获取公告（小程序用）
app.get('/api/mp/notices', (req, res) => {
  const notices = dbAll('SELECT * FROM tc_notices WHERE status = 1 ORDER BY id DESC');
  const data = notices.map(n => ({
    id: n.id,
    type: n.type,
    title: n.title,
    content: n.content,
    time: n.created_at
  }));
  res.json({ code: 0, data, msg: 'success' });
});

// 获取菜品列表（小程序用）
app.get('/api/mp/dishes', (req, res) => {
  const { meal_time, category_id, is_special } = req.query;
  let sql = 'SELECT * FROM tc_dishes WHERE status = 1';
  const params = [];
  
  if (meal_time) {
    sql += ' AND meal_time = ?';
    params.push(meal_time);
  }
  if (category_id) {
    sql += ' AND category_id = ?';
    params.push(category_id);
  }
  if (is_special !== undefined) {
    sql += ' AND is_special = ?';
    params.push(is_special);
  }
  sql += ' ORDER BY id DESC';
  
  const dishes = dbAll(sql, params);
  const data = dishes.map(d => ({
    id: d.id,
    name: d.name,
    image: d.image,
    price: d.price,
    originalPrice: d.original_price,
    description: d.description,
    unit: d.unit,
    stock: d.stock,
    sales: d.sales || 0,
    isSpecial: d.is_special === 1,
    categoryId: d.category_id,
    mealTime: d.meal_time
  }));
  res.json({ code: 0, data, msg: 'success' });
});

// 获取菜品详情（小程序用）
app.get('/api/mp/dishes/:id', (req, res) => {
  const dish = dbGet('SELECT * FROM tc_dishes WHERE id = ? AND status = 1', [req.params.id]);
  if (!dish) {
    return res.json({ code: -1, data: null, msg: '菜品不存在或已下架' });
  }
  const data = {
    id: dish.id,
    name: dish.name,
    image: dish.image,
    price: dish.price,
    originalPrice: dish.original_price,
    description: dish.description,
    unit: dish.unit,
    stock: dish.stock,
    sales: dish.sales || 0,
    isSpecial: dish.is_special === 1,
    categoryId: dish.category_id,
    mealTime: dish.meal_time
  };
  res.json({ code: 0, data, msg: 'success' });
});

// 获取分类（小程序用）
app.get('/api/mp/categories', (req, res) => {
  const categories = dbAll('SELECT * FROM tc_categories WHERE status = 1 ORDER BY sort');
  res.json({ code: 0, data: categories, msg: 'success' });
});

// 获取特价商品（小程序用）
app.get('/api/mp/specials', (req, res) => {
  const dishes = dbAll('SELECT * FROM tc_dishes WHERE status = 1 AND is_special = 1 ORDER BY id DESC');
  const data = dishes.map(d => ({
    id: d.id,
    name: d.name,
    image: d.image,
    price: d.price,
    originalPrice: d.original_price,
    description: d.description,
    unit: d.unit,
    stock: d.stock,
    isSpecial: true
  }));
  res.json({ code: 0, data, msg: 'success' });
});

// ============ 下单时间规则 API ============

// 下单时间配置
const ORDER_TIME_CONFIG = {
  workday: {
    breakfast: { hour: 17, minute: 0, dayOffset: -1, desc: '前一天17:00前' },
    lunch: { hour: 9, minute: 0, dayOffset: 0, desc: '当天9:00前' },
    dinner: { hour: 14, minute: 0, dayOffset: 0, desc: '当天14:00前' },
    afternoon: { hour: 11, minute: 0, dayOffset: 0, desc: '当天11:00前' }
  },
  weekend: {
    breakfast: { hour: 17, minute: 0, dayOffset: -1, desc: '前一天17:00前' },
    lunch: { hour: 17, minute: 0, dayOffset: -1, desc: '前一天17:00前' },
    dinner: { hour: 17, minute: 0, dayOffset: -1, desc: '前一天17:00前' },
    afternoon: { hour: 17, minute: 0, dayOffset: -1, desc: '前一天17:00前' }
  }
};

// 检查下单时间
function checkOrderTime(deliveryDate, mealTime) {
  const delivery = new Date(deliveryDate);
  const now = new Date();
  const isWeekend = delivery.getDay() === 0 || delivery.getDay() === 6;
  const config = isWeekend ? ORDER_TIME_CONFIG.weekend : ORDER_TIME_CONFIG.workday;
  const mealConfig = config[mealTime];
  
  if (!mealConfig) return { canOrder: true };
  
  const deadline = new Date(delivery);
  deadline.setDate(deadline.getDate() + mealConfig.dayOffset);
  deadline.setHours(mealConfig.hour, mealConfig.minute, 0, 0);
  
  return {
    canOrder: now < deadline,
    deadline: deadline.toISOString(),
    rule: mealConfig.desc,
    isWeekend
  };
}

// 获取下单时间规则
app.get('/api/order-rules', (req, res) => {
  res.json({ code: 0, data: ORDER_TIME_CONFIG, msg: 'success' });
});

// 检查指定日期和餐次是否可下单
app.post('/api/check-order-time', (req, res) => {
  const { deliveryDate, mealTime } = req.body;
  const result = checkOrderTime(deliveryDate, mealTime);
  res.json({ code: 0, data: result, msg: 'success' });
});

// ============ 库存校验 API ============

// 检查库存
app.post('/api/check-stock', (req, res) => {
  const { items } = req.body; // [{ dishId, quantity }]
  const insufficientItems = [];
  
  for (const item of items) {
    const dish = dbGet('SELECT id, name, stock FROM tc_dishes WHERE id = ? AND status = 1', [item.dishId]);
    if (!dish) {
      insufficientItems.push({ dishId: item.dishId, reason: '商品不存在或已下架' });
    } else if (dish.stock < item.quantity) {
      insufficientItems.push({
        dishId: item.dishId,
        name: dish.name,
        requested: item.quantity,
        available: dish.stock,
        reason: `库存不足，当前库存${dish.stock}份`
      });
    }
  }
  
  res.json({
    code: insufficientItems.length > 0 ? -1 : 0,
    data: { 
      sufficient: insufficientItems.length === 0,
      insufficientItems 
    },
    msg: insufficientItems.length > 0 ? '部分商品库存不足' : '库存充足'
  });
});

// 扣减库存
app.post('/api/deduct-stock', (req, res) => {
  const { items } = req.body; // [{ dishId, quantity }]
  
  try {
    for (const item of items) {
      dbRun('UPDATE tc_dishes SET stock = stock - ?, sales = sales + ? WHERE id = ? AND stock >= ?', 
        [item.quantity, item.quantity, item.dishId, item.quantity]);
    }
    res.json({ code: 0, msg: '库存扣减成功' });
  } catch (e) {
    res.json({ code: -1, msg: '库存扣减失败: ' + e.message });
  }
});

// 恢复库存（取消订单时）
app.post('/api/restore-stock', (req, res) => {
  const { items } = req.body;
  
  try {
    for (const item of items) {
      dbRun('UPDATE tc_dishes SET stock = stock + ?, sales = sales - ? WHERE id = ?', 
        [item.quantity, item.quantity, item.dishId]);
    }
    res.json({ code: 0, msg: '库存恢复成功' });
  } catch (e) {
    res.json({ code: -1, msg: '库存恢复失败: ' + e.message });
  }
});

// ============ 飞鹅云打印机 API ============

// 获取打印机配置状态
app.get('/api/printer/config', (req, res) => {
  const config = printer.checkConfig();
  res.json({ code: 0, data: config, msg: 'success' });
});

// 更新打印机配置
app.post('/api/printer/config', (req, res) => {
  const { user, ukey, printerSn } = req.body;
  printer.updateConfig({ user, ukey, printerSn });
  res.json({ code: 0, msg: '配置已更新' });
});

// 查询打印机状态
app.get('/api/printer/status', async (req, res) => {
  const { sn } = req.query;
  const config = printer.checkConfig();
  
  if (!config.configured) {
    return res.json({ code: -1, msg: '请先配置飞鹅云账号', data: { configured: false } });
  }
  
  try {
    const result = await printer.queryPrinterStatus(sn || printer.FEIE_CONFIG.PRINTER_SN);
    res.json({ code: 0, data: result, msg: 'success' });
  } catch (e) {
    res.json({ code: -1, msg: e.message });
  }
});

// 添加打印机
app.post('/api/printer/add', async (req, res) => {
  const { sn, key, name, phone } = req.body;
  
  try {
    const result = await printer.addPrinter(sn, key, name, phone);
    res.json({ code: 0, data: result, msg: 'success' });
  } catch (e) {
    res.json({ code: -1, msg: e.message });
  }
});

// 打印订单
app.post('/api/printer/print', async (req, res) => {
  const { order, times, sn } = req.body;
  
  try {
    const result = await printer.printOrder(order, times || 1, sn);
    res.json({ 
      code: result.success ? 0 : -1, 
      data: result, 
      msg: result.msg 
    });
  } catch (e) {
    res.json({ code: -1, msg: e.message });
  }
});

// 查询打印订单状态
app.get('/api/printer/order-state', async (req, res) => {
  const { orderId } = req.query;
  
  try {
    const result = await printer.queryOrderState(orderId);
    res.json({ code: 0, data: result, msg: 'success' });
  } catch (e) {
    res.json({ code: -1, msg: e.message });
  }
});

// 清空打印队列
app.post('/api/printer/clear-queue', async (req, res) => {
  const { sn } = req.body;
  
  try {
    const result = await printer.clearPrintQueue(sn || printer.FEIE_CONFIG.PRINTER_SN);
    res.json({ code: 0, data: result, msg: 'success' });
  } catch (e) {
    res.json({ code: -1, msg: e.message });
  }
});

// ============ 文件上传 API ============
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    require('fs').mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    res.json({ code: 0, data: { url: `/uploads/${req.file.filename}` }, msg: '上传成功' });
  } else {
    res.json({ code: -1, msg: '上传失败' });
  }
});

// 首页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 全局错误处理（必须放在所有路由之后）
app.use((err, req, res, next) => {
  console.error('[HTTP] Unhandled error:', err);
  if (res.headersSent) return next(err);
  res.status(500).json({
    code: -1,
    msg: err?.message || '服务器内部错误'
  });
});

// 启动服务器（需要先初始化数据库）
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`  团餐管理系统后台已启动`);
    console.log(`  访问地址: http://localhost:${PORT}`);
    console.log(`========================================\n`);
  });
}).catch(err => {
  console.error('数据库初始化失败:', err);
  process.exit(1);
});
