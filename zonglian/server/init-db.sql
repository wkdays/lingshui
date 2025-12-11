-- 总链数据库初始化脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS zonglian DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zonglian;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  nickname VARCHAR(50) DEFAULT '新用户',
  avatar VARCHAR(255),
  role VARCHAR(20) DEFAULT '普通用户',
  balance DECIMAL(10,2) DEFAULT 0,
  points INT DEFAULT 0,
  level VARCHAR(20) DEFAULT '普通会员',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 轮播图表
CREATE TABLE IF NOT EXISTS banners (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  `desc` VARCHAR(500),
  image_url VARCHAR(500),
  gradient VARCHAR(100),
  link VARCHAR(500),
  status VARCHAR(20) DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 公告表
CREATE TABLE IF NOT EXISTS announcements (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 任务表
CREATE TABLE IF NOT EXISTS tasks (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  unit VARCHAR(50) DEFAULT '元/单',
  type ENUM('daily', 'bounty') DEFAULT 'daily',
  location VARCHAR(50) DEFAULT '线上',
  tag VARCHAR(50),
  people_needed INT DEFAULT 10,
  publisher VARCHAR(100) DEFAULT '平台发布',
  publisher_id VARCHAR(50),
  status VARCHAR(20) DEFAULT 'open',
  work_date VARCHAR(50),
  work_period VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==================== 初始数据 ====================

-- 用户数据
INSERT INTO users (id, phone, password, nickname, role, balance, points, level) VALUES
('u_admin', '13800138000', '123456', '管理员', '管理员', 9999, 99999, '超级会员'),
('u_001', '13800138001', '123456', '朱墨染', '普通用户', 120.5, 2760, '银卡会员'),
('u_002', '13800138002', '123456', '测试用户', '普通用户', 50, 100, '普通会员')
ON DUPLICATE KEY UPDATE nickname=VALUES(nickname);

-- 轮播图数据
INSERT INTO banners (id, title, `desc`, image_url, gradient, link, status) VALUES
('b_1', '多多进鱼', '一款专门做APP应用推广主端平台', '', '["#3a7bff", "#3a9dff"]', '', 'published'),
('b_2', '邀请好友每日领20元', '好友下单立返奖励', '', '["#ff7c3c", "#ff9f58"]', '', 'published')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 公告数据
INSERT INTO announcements (id, title, content, status, created_at) VALUES
('a_1', '系统维护通知', '12月12日01:00-03:00进行升级维护', 'published', '2025-12-10 10:00:00'),
('a_2', '邀请好友奖励升级', '好友完成首单奖励20元', 'published', '2025-12-09 10:00:00'),
('a_3', '总链平台上线公告', '欢迎使用总链任务平台，快来接单赚钱吧！', 'published', '2025-12-08 10:00:00')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 任务数据
INSERT INTO tasks (id, title, description, price, unit, type, location, tag, people_needed, publisher, status, work_date, work_period) VALUES
('t_1', 'APP注册下载', '简单注册下载即可完成，秒审核', 9, '元/单', 'daily', '线上', '热门', 100, '高薪速聘', 'open', '今日结算', '10分钟内完成'),
('t_2', '游戏试玩体验', '下载游戏试玩5分钟，截图提交', 17, '元/单', 'bounty', '线上', '精选', 50, '赏金派单', 'open', '今日结算', '30分钟内完成'),
('t_3', '直播点赞互动', '直播间在线点赞互动，完成截图提交', 25, '元/单', 'bounty', '线上', '直播', 50, '互动达人', 'open', '截止今日23:59', '30分钟内完成'),
('t_4', '门店盘点录入', '到店进行商品盘点、数据录入，需签到打卡', 80, '元/天', 'daily', '线下', '日结', 3, '门店经理', 'open', '2025-12-12', '09:00-18:00'),
('t_5', '地推扫码拉新', '商场/超市门口推广扫码，引导用户注册', 5, '元/人', 'daily', '线下', '地推', 20, '推广团队', 'open', '今日结算', '09:00-21:00'),
('t_6', '问卷调查填写', '在线完成问卷调查，约10分钟', 8, '元/份', 'bounty', '线上', '简单', 200, '调研中心', 'open', '长期有效', '随时可做'),
('t_7', '活动现场协助', '协助活动现场布置、签到引导、物料发放', 150, '元/天', 'daily', '线下', '活动', 10, '活动策划', 'open', '2025-12-15', '08:00-18:00')
ON DUPLICATE KEY UPDATE title=VALUES(title);

SELECT '数据库初始化完成！' AS message;
SELECT COUNT(*) AS users_count FROM users;
SELECT COUNT(*) AS banners_count FROM banners;
SELECT COUNT(*) AS announcements_count FROM announcements;
SELECT COUNT(*) AS tasks_count FROM tasks;
