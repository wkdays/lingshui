const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  port: process.env.DB_PORT || 3306
}

const dbName = process.env.DB_NAME || 'portal_db'

async function initDatabase() {
  let connection
  
  try {
    // 连接MySQL（不指定数据库）
    connection = await mysql.createConnection(config)
    console.log('Connected to MySQL')

    // 创建数据库
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
    console.log(`Database ${dbName} created or already exists`)

    // 使用数据库
    await connection.query(`USE ${dbName}`)

    // 创建管理员表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('Table admins created')

    // 创建新闻动态表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS news (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        summary TEXT,
        content LONGTEXT,
        cover VARCHAR(500),
        recommend TINYINT DEFAULT 0,
        views INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    console.log('Table news created')

    // 创建招标公告表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bidding (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        summary TEXT,
        content LONGTEXT,
        cover VARCHAR(500),
        recommend TINYINT DEFAULT 0,
        views INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    console.log('Table bidding created')

    // 创建项目进度表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS project (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        summary TEXT,
        content LONGTEXT,
        cover VARCHAR(500),
        progress INT DEFAULT 0,
        recommend TINYINT DEFAULT 0,
        views INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    console.log('Table project created')

    // 创建党建工作表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS party (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        summary TEXT,
        content LONGTEXT,
        cover VARCHAR(500),
        recommend TINYINT DEFAULT 0,
        views INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    console.log('Table party created')

    // 创建轮播图表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS carousel (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        image VARCHAR(500) NOT NULL,
        description TEXT,
        sort INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('Table carousel created')

    // 插入默认管理员（密码: admin）
    const hashedPassword = await bcrypt.hash('admin', 10)
    await connection.query(`
      INSERT IGNORE INTO admins (username, password) VALUES ('admin', ?)
    `, [hashedPassword])
    console.log('Default admin user created (username: admin, password: admin)')

    // 插入默认轮播图数据
    const [carouselCheck] = await connection.query('SELECT COUNT(*) as count FROM carousel')
    if (carouselCheck[0].count === 0) {
      await connection.query(`
        INSERT INTO carousel (title, image, description, sort) VALUES 
        ('数字经济创新发展', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=400&fit=crop', '推动数字技术与实体经济深度融合，打造数字经济新高地', 1),
        ('智慧城市建设', 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&h=400&fit=crop', '构建城市数字化底座，赋能城市治理现代化', 2),
        ('低空经济新赛道', 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&h=400&fit=crop', '开拓低空经济新蓝海，引领产业创新发展', 3)
      `)
      console.log('Default carousel data inserted')
    }

    // 插入默认新闻数据
    const [newsCheck] = await connection.query('SELECT COUNT(*) as count FROM news')
    if (newsCheck[0].count === 0) {
      await connection.query(`
        INSERT INTO news (title, summary, content, cover, recommend) VALUES 
        ('公司成功签约数智城市项目', '近日，公司与某市政府成功签约数智城市建设项目，将为城市数字化转型提供全方位解决方案。', '<p>近日，公司与某市政府成功签约数智城市建设项目，将为城市数字化转型提供全方位解决方案，助力智慧城市建设迈上新台阶。</p><p>本次签约的数智城市项目总投资额达数亿元，建设周期为三年，涵盖城市治理、公共服务、产业发展等多个领域。项目建成后，将显著提升城市运行效率和市民生活品质。</p>', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop', 1),
        ('低空经济发展规划正式发布', '公司发布低空经济发展规划，明确未来三年发展目标和重点任务。', '<p>公司发布低空经济发展规划，明确未来三年发展目标和重点任务，抢占低空经济新赛道。</p>', 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=400&fit=crop', 1),
        ('数字经济供应链平台正式上线', '历时半年精心打造的数字经济供应链平台正式上线运营。', '<p>历时半年精心打造的数字经济供应链平台正式上线运营，为企业提供一站式数字化服务。</p>', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop', 1)
      `)
      console.log('Default news data inserted')
    }

    // 插入默认招标公告数据
    const [biddingCheck] = await connection.query('SELECT COUNT(*) as count FROM bidding')
    if (biddingCheck[0].count === 0) {
      await connection.query(`
        INSERT INTO bidding (title, summary, content) VALUES 
        ('智慧园区建设项目招标公告', '就智慧园区建设项目进行公开招标，欢迎符合条件的供应商参与投标。', '<h3>一、项目概况</h3><p>就智慧园区建设项目进行公开招标，欢迎符合条件的供应商参与投标。</p><h3>二、投标人资格要求</h3><ul><li>具有独立法人资格</li><li>具有相关行业资质</li></ul>'),
        ('数据中心设备采购招标公告', '现就数据中心服务器、存储设备等进行公开招标采购。', '<p>现就数据中心服务器、存储设备等进行公开招标采购。</p>')
      `)
      console.log('Default bidding data inserted')
    }

    // 插入默认项目进度数据
    const [projectCheck] = await connection.query('SELECT COUNT(*) as count FROM project')
    if (projectCheck[0].count === 0) {
      await connection.query(`
        INSERT INTO project (title, summary, content, progress) VALUES 
        ('数智城市一期项目', '项目已完成需求分析和系统设计阶段，正在进行核心模块开发。', '<h3>项目概述</h3><p>数智城市一期项目旨在构建城市数字化底座。</p><h3>当前进度</h3><p>整体进度：65%</p>', 65),
        ('低空经济平台建设', '平台架构设计已完成，正在进行飞行监管模块开发测试。', '<p>平台架构设计已完成，正在进行飞行监管模块开发测试。</p>', 40),
        ('供应链数字化改造', '已完成供应商管理模块上线，正在推进物流跟踪功能开发。', '<p>已完成供应商管理模块上线。</p>', 80)
      `)
      console.log('Default project data inserted')
    }

    // 插入默认党建工作数据
    const [partyCheck] = await connection.query('SELECT COUNT(*) as count FROM party')
    if (partyCheck[0].count === 0) {
      await connection.query(`
        INSERT INTO party (title, summary, content, cover, recommend) VALUES 
        ('党支部开展"学思想、强党性"主题党日活动', '公司党支部组织全体党员开展主题党日活动，深入学习党的创新理论。', '<p>为深入学习贯彻习近平新时代中国特色社会主义思想，公司党支部组织全体党员开展"学思想、强党性"主题党日活动。</p>', 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&h=400&fit=crop', 1),
        ('深入学习贯彻党的二十大精神', '公司组织专题学习会，深入学习贯彻党的二十大精神。', '<p>公司组织专题学习会，深入学习贯彻党的二十大精神。</p>', 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&h=400&fit=crop', 1),
        ('党员志愿服务进社区', '公司党员志愿者走进社区，开展数字技能培训志愿服务活动。', '<p>公司党员志愿者走进社区，开展数字技能培训志愿服务活动。</p>', 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop', 0)
      `)
      console.log('Default party data inserted')
    }

    console.log('\n=================================')
    console.log('Database initialization completed!')
    console.log('=================================\n')

  } catch (error) {
    console.error('Database initialization error:', error)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

initDatabase()
