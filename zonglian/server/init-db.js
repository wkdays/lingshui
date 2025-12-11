const mysql = require('mysql2/promise')

// MySQL配置
const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
}

async function initDatabase() {
  let connection
  try {
    connection = await mysql.createConnection(config)
    
    // 创建数据库
    await connection.query('CREATE DATABASE IF NOT EXISTS zonglian CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci')
    console.log('✓ 数据库 zonglian 创建成功')
    
    await connection.query('USE zonglian')
    
    // 创建用户表（统一账号体系，所有小程序共用）
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        phone VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        nickname VARCHAR(50) DEFAULT '新用户',
        avatar VARCHAR(500) DEFAULT '/static/avatar.png',
        role VARCHAR(20) DEFAULT '普通用户',
        balance DECIMAL(10,2) DEFAULT 0,
        points INT DEFAULT 0,
        level VARCHAR(20) DEFAULT '普通会员',
        status VARCHAR(20) DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ 表 users 创建成功（统一账号）')
    
    // 创建轮播图表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS banners (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        \`desc\` VARCHAR(255),
        image_url VARCHAR(500),
        gradient VARCHAR(100),
        link VARCHAR(500),
        status VARCHAR(20) DEFAULT 'published',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ 表 banners 创建成功')
    
    // 创建公告表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        content TEXT,
        status VARCHAR(20) DEFAULT 'draft',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ 表 announcements 创建成功')
    
    // 插入示例用户（使用不同头像）
    await connection.query(`
      INSERT IGNORE INTO users (id, phone, password, nickname, avatar, role, balance, points, level) VALUES
      ('u_admin', '13800138000', '123456', '管理员', '/avatar.png', '管理员', 1000.00, 10000, '钻石会员'),
      ('u_test', '13800138001', '123456', '测试用户', '/avatar-default.png', '普通用户', 120.50, 2760, '银卡会员')
    `)
    console.log('✓ 示例用户创建成功')
    console.log('   管理员账号: 13800138000 / 123456')
    console.log('   测试账号:   13800138001 / 123456')
    
    // 插入示例数据
    await connection.query(`
      INSERT IGNORE INTO banners (id, title, \`desc\`, gradient, status) VALUES
      ('b1', '多多进鱼', '一款专门做APP应用推广主端平台', '["#3a7bff","#3a9dff"]', 'published'),
      ('b2', '邀请好友每日领20元', '好友下单立返奖励', '["#ff7c3c","#ff9f58"]', 'published')
    `)
    
    await connection.query(`
      INSERT IGNORE INTO announcements (id, title, content, status) VALUES
      ('a1', '系统维护通知', '12月12日01:00-03:00进行升级维护', 'published'),
      ('a2', '邀请好友奖励升级', '好友完成首单奖励20元', 'published'),
      ('a3', '总链平台上线公告', '欢迎使用总链任务平台，快来接单赚钱吧！', 'published')
    `)
    console.log('✓ 示例数据插入成功')
    
    console.log('\n🎉 数据库初始化完成!')
    
  } catch (err) {
    console.error('❌ 数据库初始化失败:', err.message)
    console.log('\n请确保:')
    console.log('1. MySQL服务已启动')
    console.log('2. db.js 中的用户名密码正确')
  } finally {
    if (connection) await connection.end()
  }
}

initDatabase()
