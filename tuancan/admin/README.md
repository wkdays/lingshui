# 团餐管理系统后台

基于 Node.js + Express + SQLite 的团餐订购管理系统后台。

## 功能模块

### 1. 菜品与套餐管理
- ✅ 新增、编辑、删除菜品
- ✅ 配置价格、单位、库存
- ✅ 设置可售时间段（早餐/午餐/晚餐/下午茶）
- ✅ 控制上下架状态
- ✅ 设置特价商品

### 2. 轮播信息管理
- ✅ 配置轮播图片、标题、副标题
- ✅ 设置跳转链接
- ✅ 排序和显示控制

### 3. 公告发布管理
- ✅ 新增、编辑公告
- ✅ 公告类型（通知/活动/系统）
- ✅ 控制发布和下线

### 4. 分类管理
- ✅ 管理菜品分类
- ✅ 分类排序

## 运行方式

```bash
# 进入管理端目录
cd admin

# 安装依赖
npm install

# 启动服务（开发模式）
npm run dev

# 启动服务（生产模式）
npm start
```

服务启动后访问：http://localhost:3001

## API 接口

### 菜品管理
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/dishes | 获取菜品列表 |
| GET | /api/dishes/:id | 获取菜品详情 |
| POST | /api/dishes | 新增菜品 |
| PUT | /api/dishes/:id | 更新菜品 |
| DELETE | /api/dishes/:id | 删除菜品 |
| PUT | /api/dishes/:id/status | 上下架菜品 |

### 分类管理
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/categories | 获取分类列表 |
| POST | /api/categories | 新增分类 |
| PUT | /api/categories/:id | 更新分类 |
| DELETE | /api/categories/:id | 删除分类 |

### 轮播管理
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/banners | 获取轮播列表 |
| POST | /api/banners | 新增轮播 |
| PUT | /api/banners/:id | 更新轮播 |
| DELETE | /api/banners/:id | 删除轮播 |

### 公告管理
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/notices | 获取公告列表 |
| POST | /api/notices | 新增公告 |
| PUT | /api/notices/:id | 更新公告 |
| DELETE | /api/notices/:id | 删除公告 |
| PUT | /api/notices/:id/status | 发布/下线公告 |

### 文件上传
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/upload | 上传文件 |

## 数据库

使用 SQLite 数据库，文件位于 `admin/tuancan.db`。

### 表结构

- `tc_dishes` - 菜品表
- `tc_categories` - 分类表
- `tc_banners` - 轮播表
- `tc_notices` - 公告表

## 技术栈

- **后端**: Node.js + Express
- **数据库**: SQLite (better-sqlite3)
- **前端**: Vue 3 + TailwindCSS
- **图标**: FontAwesome
