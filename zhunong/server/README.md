# 团购小程序系统 - 服务端

技术栈：Node.js + Express + MySQL

## 1) 配置

在 `server/` 目录创建 `.env`：

```bash
PORT=3000
JWT_SECRET=replace_me

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tuangou
```

## 2) 初始化数据库

- 建库：`CREATE DATABASE tuangou DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;`
- 导入表结构与示例数据：执行 `server/sql/schema.sql`

也可执行（需要已配置 `.env` 且可连接 MySQL）：

```bash
npm run init-db
```

## 3) 启动

```bash
npm install
npm run dev
```

默认监听：`http://127.0.0.1:3000`

