const mysql = require('mysql2/promise')

// MySQL配置 - 请根据实际情况修改
const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'zonglian',
  waitForConnections: true,
  connectionLimit: 10,
}

const pool = mysql.createPool(config)

module.exports = pool
