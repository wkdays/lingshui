-- ============================================
-- 团餐小程序数据库表设计
-- 前缀：tc_ (tuancan)
-- 注意：用户表、余额表、交易记录表使用zonglian共享表，不在此建立
-- ============================================

-- --------------------------------------------
-- 1. 轮播图表（对应需求5：顶部轮播信息）
-- 后台维护
-- --------------------------------------------
CREATE TABLE `tc_banners` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(100) DEFAULT NULL COMMENT '标题',
  `image_url` VARCHAR(500) NOT NULL COMMENT '图片地址',
  `link_url` VARCHAR(500) DEFAULT NULL COMMENT '跳转链接',
  `sort_order` INT DEFAULT 0 COMMENT '排序，数字越小越靠前',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0下架 1上架',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status_sort` (`status`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='轮播图';

-- --------------------------------------------
-- 2. 公告表（对应需求6：公告展示）
-- 后台维护
-- --------------------------------------------
CREATE TABLE `tc_announcements` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL COMMENT '公告标题',
  `content` TEXT COMMENT '公告内容',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0下线 1发布',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='公告';

-- --------------------------------------------
-- 3. 消息表（对应需求7：消息中心）
-- 订单状态变更、配送提醒等自动生成
-- --------------------------------------------
CREATE TABLE `tc_messages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID（关联zonglian.users）',
  `title` VARCHAR(100) NOT NULL COMMENT '消息标题',
  `content` VARCHAR(500) DEFAULT NULL COMMENT '消息内容',
  `type` VARCHAR(20) DEFAULT 'order' COMMENT '消息类型：order订单 delivery配送 system系统',
  `order_id` INT UNSIGNED DEFAULT NULL COMMENT '关联订单ID',
  `is_read` TINYINT DEFAULT 0 COMMENT '是否已读：0未读 1已读',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_read` (`user_id`, `is_read`),
  KEY `idx_user_created` (`user_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息中心';

-- --------------------------------------------
-- 4. 菜品/套餐表（对应需求8-10）
-- 后台维护，支持推荐、分时段
-- --------------------------------------------
CREATE TABLE `tc_dishes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT '菜品名称',
  `image_url` VARCHAR(500) DEFAULT NULL COMMENT '菜品图片',
  `description` TEXT COMMENT '菜品简介',
  `price` DECIMAL(10,2) NOT NULL COMMENT '单价',
  `unit` VARCHAR(20) DEFAULT '份' COMMENT '单位',
  `category` VARCHAR(50) DEFAULT NULL COMMENT '分类',
  `meal_time` VARCHAR(50) DEFAULT NULL COMMENT '供应时段：breakfast早餐 lunch午餐 dinner晚餐 afternoon下午茶，多个用逗号分隔',
  `available_date` DATE DEFAULT NULL COMMENT '供应日期，NULL表示长期',
  `is_recommended` TINYINT DEFAULT 0 COMMENT '是否推荐：0否 1是（首页橱窗展示）',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0下架 1上架',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status_recommend` (`status`, `is_recommended`),
  KEY `idx_meal_time` (`meal_time`),
  KEY `idx_available_date` (`available_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜品/套餐';

-- --------------------------------------------
-- 5. 订单表（对应需求11-16）
-- --------------------------------------------
CREATE TABLE `tc_orders` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_no` VARCHAR(32) NOT NULL COMMENT '订单号',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID（关联zonglian.users）',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
  `status` TINYINT DEFAULT 0 COMMENT '订单状态：0待支付 1已支付 2配送中 3已完成 4已取消',
  `delivery_date` DATE NOT NULL COMMENT '配送日期',
  `delivery_time` VARCHAR(50) DEFAULT NULL COMMENT '配送时段',
  `delivery_address` VARCHAR(500) NOT NULL COMMENT '配送地址/单位信息',
  `contact_name` VARCHAR(50) DEFAULT NULL COMMENT '联系人',
  `contact_phone` VARCHAR(20) NOT NULL COMMENT '联系电话',
  `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
  `paid_at` DATETIME DEFAULT NULL COMMENT '支付时间',
  `cancelled_at` DATETIME DEFAULT NULL COMMENT '取消时间',
  `cancel_reason` VARCHAR(200) DEFAULT NULL COMMENT '取消原因',
  `print_status` TINYINT DEFAULT 0 COMMENT '打印状态：0未打印 1已打印',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_status` (`user_id`, `status`),
  KEY `idx_delivery_date` (`delivery_date`),
  KEY `idx_print_status` (`print_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='团餐订单';

-- --------------------------------------------
-- 6. 订单明细表（对应需求14：菜品明细）
-- --------------------------------------------
CREATE TABLE `tc_order_items` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` INT UNSIGNED NOT NULL COMMENT '订单ID',
  `dish_id` INT UNSIGNED NOT NULL COMMENT '菜品ID',
  `dish_name` VARCHAR(100) NOT NULL COMMENT '菜品名称（冗余，防止菜品修改影响历史订单）',
  `dish_image` VARCHAR(500) DEFAULT NULL COMMENT '菜品图片（冗余）',
  `price` DECIMAL(10,2) NOT NULL COMMENT '单价（冗余）',
  `quantity` INT NOT NULL DEFAULT 1 COMMENT '数量/份数',
  `subtotal` DECIMAL(10,2) NOT NULL COMMENT '小计金额',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单明细';

-- ============================================
-- 说明：
-- 1. 用户信息、余额、交易记录使用zonglian共享表
-- 2. 下单支付时调用zonglian余额扣减接口
-- 3. 退款时调用zonglian退款接口
-- 4. 取消订单规则：提前1天可取消，当天不可取消
-- ============================================
