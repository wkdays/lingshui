/**
 * 团餐管理系统后台 - Node.js + Express
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 初始化数据库
const db = new Database(path.join(__dirname, 'tuancan.db'));

// 创建表
db.exec(`
  -- 菜品/套餐表
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
  );

  -- 菜品分类表
  CREATE TABLE IF NOT EXISTS tc_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sort INTEGER DEFAULT 0,
    status INTEGER DEFAULT 1
  );

  -- 轮播图表
  CREATE TABLE IF NOT EXISTS tc_banners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    link TEXT,
    sort INTEGER DEFAULT 0,
    status INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  -- 公告表
  CREATE TABLE IF NOT EXISTS tc_notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    type TEXT DEFAULT 'notice',
    status INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// 插入默认分类
const categoryCount = db.prepare('SELECT COUNT(*) as count FROM tc_categories').get();
if (categoryCount.count === 0) {
  db.exec(`
    INSERT INTO tc_categories (name, sort) VALUES ('全部', 0);
    INSERT INTO tc_categories (name, sort) VALUES ('早餐', 1);
    INSERT INTO tc_categories (name, sort) VALUES ('午餐', 2);
    INSERT INTO tc_categories (name, sort) VALUES ('晚餐', 3);
    INSERT INTO tc_categories (name, sort) VALUES ('下午茶', 4);
    INSERT INTO tc_categories (name, sort) VALUES ('特价', 5);
  `);
}

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
  
  const dishes = db.prepare(sql).all(...params);
  res.json({ code: 0, data: dishes, msg: 'success' });
});

// 获取菜品详情
app.get('/api/dishes/:id', (req, res) => {
  const dish = db.prepare('SELECT * FROM tc_dishes WHERE id = ?').get(req.params.id);
  res.json({ code: 0, data: dish, msg: 'success' });
});

// 新增菜品
app.post('/api/dishes', (req, res) => {
  const { name, image, price, original_price, category_id, description, unit, stock, is_special, meal_time, status } = req.body;
  const result = db.prepare(`
    INSERT INTO tc_dishes (name, image, price, original_price, category_id, description, unit, stock, is_special, meal_time, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, image, price, original_price || price, category_id, description, unit || '份', stock || 100, is_special || 0, meal_time || 'lunch', status || 1);
  res.json({ code: 0, data: { id: result.lastInsertRowid }, msg: '添加成功' });
});

// 更新菜品
app.put('/api/dishes/:id', (req, res) => {
  const { name, image, price, original_price, category_id, description, unit, stock, is_special, meal_time, status } = req.body;
  db.prepare(`
    UPDATE tc_dishes SET name=?, image=?, price=?, original_price=?, category_id=?, description=?, unit=?, stock=?, is_special=?, meal_time=?, status=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(name, image, price, original_price, category_id, description, unit, stock, is_special, meal_time, status, req.params.id);
  res.json({ code: 0, msg: '更新成功' });
});

// 删除菜品
app.delete('/api/dishes/:id', (req, res) => {
  db.prepare('DELETE FROM tc_dishes WHERE id = ?').run(req.params.id);
  res.json({ code: 0, msg: '删除成功' });
});

// 上下架菜品
app.put('/api/dishes/:id/status', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE tc_dishes SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ code: 0, msg: status === 1 ? '已上架' : '已下架' });
});

// ============ 分类管理 API ============

app.get('/api/categories', (req, res) => {
  const categories = db.prepare('SELECT * FROM tc_categories ORDER BY sort').all();
  res.json({ code: 0, data: categories, msg: 'success' });
});

app.post('/api/categories', (req, res) => {
  const { name, sort } = req.body;
  const result = db.prepare('INSERT INTO tc_categories (name, sort) VALUES (?, ?)').run(name, sort || 0);
  res.json({ code: 0, data: { id: result.lastInsertRowid }, msg: '添加成功' });
});

app.put('/api/categories/:id', (req, res) => {
  const { name, sort, status } = req.body;
  db.prepare('UPDATE tc_categories SET name=?, sort=?, status=? WHERE id=?').run(name, sort, status, req.params.id);
  res.json({ code: 0, msg: '更新成功' });
});

app.delete('/api/categories/:id', (req, res) => {
  db.prepare('DELETE FROM tc_categories WHERE id = ?').run(req.params.id);
  res.json({ code: 0, msg: '删除成功' });
});

// ============ 轮播图管理 API ============

app.get('/api/banners', (req, res) => {
  const banners = db.prepare('SELECT * FROM tc_banners ORDER BY sort, id DESC').all();
  res.json({ code: 0, data: banners, msg: 'success' });
});

app.post('/api/banners', (req, res) => {
  const { image, title, subtitle, link, sort, status } = req.body;
  const result = db.prepare('INSERT INTO tc_banners (image, title, subtitle, link, sort, status) VALUES (?, ?, ?, ?, ?, ?)')
    .run(image, title, subtitle, link, sort || 0, status || 1);
  res.json({ code: 0, data: { id: result.lastInsertRowid }, msg: '添加成功' });
});

app.put('/api/banners/:id', (req, res) => {
  const { image, title, subtitle, link, sort, status } = req.body;
  db.prepare('UPDATE tc_banners SET image=?, title=?, subtitle=?, link=?, sort=?, status=? WHERE id=?')
    .run(image, title, subtitle, link, sort, status, req.params.id);
  res.json({ code: 0, msg: '更新成功' });
});

app.delete('/api/banners/:id', (req, res) => {
  db.prepare('DELETE FROM tc_banners WHERE id = ?').run(req.params.id);
  res.json({ code: 0, msg: '删除成功' });
});

// ============ 公告管理 API ============

app.get('/api/notices', (req, res) => {
  const notices = db.prepare('SELECT * FROM tc_notices ORDER BY id DESC').all();
  res.json({ code: 0, data: notices, msg: 'success' });
});

app.post('/api/notices', (req, res) => {
  const { title, content, type, status } = req.body;
  const result = db.prepare('INSERT INTO tc_notices (title, content, type, status) VALUES (?, ?, ?, ?)')
    .run(title, content, type || 'notice', status || 1);
  res.json({ code: 0, data: { id: result.lastInsertRowid }, msg: '添加成功' });
});

app.put('/api/notices/:id', (req, res) => {
  const { title, content, type, status } = req.body;
  db.prepare('UPDATE tc_notices SET title=?, content=?, type=?, status=? WHERE id=?')
    .run(title, content, type, status, req.params.id);
  res.json({ code: 0, msg: '更新成功' });
});

app.delete('/api/notices/:id', (req, res) => {
  db.prepare('DELETE FROM tc_notices WHERE id = ?').run(req.params.id);
  res.json({ code: 0, msg: '删除成功' });
});

// 发布/下线公告
app.put('/api/notices/:id/status', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE tc_notices SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ code: 0, msg: status === 1 ? '已发布' : '已下线' });
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

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`  团餐管理系统后台已启动`);
  console.log(`  访问地址: http://localhost:${PORT}`);
  console.log(`========================================\n`);
});
