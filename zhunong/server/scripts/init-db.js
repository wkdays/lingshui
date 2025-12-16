import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import mysql from 'mysql2/promise'

const schemaPath = path.resolve(process.cwd(), 'sql/schema.sql')
const schemaSql = fs.readFileSync(schemaPath, 'utf8')

const {
  DB_HOST = '127.0.0.1',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'tuangou'
} = process.env

const run = async () => {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true
  })

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  )
  await connection.changeUser({ database: DB_NAME })
  await connection.query(schemaSql)
  await connection.end()
}

run()
  .then(() => {
    console.log('init-db: done')
    process.exit(0)
  })
  .catch(err => {
    console.error('init-db: failed', err)
    process.exit(1)
  })

