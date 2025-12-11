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
  status VARCHAR(20) DEFAULT 'open',
  work_date VARCHAR(50),
  work_period VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入测试数据
INSERT INTO tasks (id, title, description, price, unit, type, location, tag, people_needed, publisher, status, work_date, work_period) VALUES
('t_1', 'APP注册下载', '简单注册下载即可完成，秒审核', 9, '元/单', 'daily', '线上', '热门', 100, '高薪速聘', 'open', '今日结算', '10分钟内完成'),
('t_2', '游戏试玩体验', '下载游戏试玩5分钟，截图提交', 17, '元/单', 'bounty', '线上', '精选', 50, '赏金派单', 'open', '今日结算', '30分钟内完成'),
('t_3', '直播点赞互动', '直播间在线点赞互动，完成截图提交', 25, '元/单', 'bounty', '线上', '直播', 50, '互动达人', 'open', '截止今日23:59', '30分钟内完成'),
('t_4', '门店盘点录入', '到店进行商品盘点、数据录入，需签到打卡', 80, '元/天', 'daily', '线下', '日结', 3, '门店经理', 'open', '2025-12-12', '09:00-18:00'),
('t_5', '地推扫码拉新', '商场/超市门口推广扫码，引导用户注册', 5, '元/人', 'daily', '线下', '地推', 20, '推广团队', 'open', '今日结算', '09:00-21:00'),
('t_6', '问卷调查填写', '在线完成问卷调查，约10分钟', 8, '元/份', 'bounty', '线上', '简单', 200, '调研中心', 'open', '长期有效', '随时可做'),
('t_7', '活动现场协助', '协助活动现场布置、签到引导、物料发放', 150, '元/天', 'daily', '线下', '活动', 10, '活动策划', 'open', '2025-12-15', '08:00-18:00');
