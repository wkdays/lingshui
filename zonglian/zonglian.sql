/*
 Navicat Premium Dump SQL

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80043 (8.0.43)
 Source Host           : localhost:3306
 Source Schema         : zonglian

 Target Server Type    : MySQL
 Target Server Version : 80043 (8.0.43)
 File Encoding         : 65001

 Date: 11/12/2025 20:31:35
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for announcements
-- ----------------------------
DROP TABLE IF EXISTS `announcements`;
CREATE TABLE `announcements`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'draft',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of announcements
-- ----------------------------
INSERT INTO `announcements` VALUES ('a_1', '系统维护通知', '12月12日01:00-03:00进行升级维护', 'published', '2025-12-10 10:00:00');
INSERT INTO `announcements` VALUES ('a_2', '邀请好友奖励升级', '好友完成首单奖励20元', 'published', '2025-12-09 10:00:00');
INSERT INTO `announcements` VALUES ('a_3', '总链平台上线公告', '欢迎使用总链任务平台，快来接单赚钱吧！', 'published', '2025-12-08 10:00:00');

-- ----------------------------
-- Table structure for banners
-- ----------------------------
DROP TABLE IF EXISTS `banners`;
CREATE TABLE `banners`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `gradient` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `link` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'published',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of banners
-- ----------------------------
INSERT INTO `banners` VALUES ('b1', '多多进鱼', '一款专门做APP应用推广主端平台', '/uploads/banner_1765439261219.png', '[]', '', 'published', '2025-12-11 14:58:15');
INSERT INTO `banners` VALUES ('b2', '邀请好友每日领20元', '好友下单立返奖励', '/uploads/banner_1765439265052.png', '[]', '', 'published', '2025-12-11 14:58:15');

-- ----------------------------
-- Table structure for task_orders
-- ----------------------------
DROP TABLE IF EXISTS `task_orders`;
CREATE TABLE `task_orders`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `task_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'pending',
  `submit_info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `submit_time` timestamp NULL DEFAULT NULL,
  `review_time` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of task_orders
-- ----------------------------
INSERT INTO `task_orders` VALUES ('o_1', 't_1', 'u_001', '朱墨染', 'approved', NULL, NULL, '2025-12-11 17:01:42', '2025-12-11 16:55:04');
INSERT INTO `task_orders` VALUES ('o_1765443908592', 't_7', 'u_test', '朱墨染', 'pending', NULL, NULL, NULL, '2025-12-11 17:05:08');
INSERT INTO `task_orders` VALUES ('o_1765445019639', 't_2', 'u_test', '朱墨染', 'pending', NULL, NULL, NULL, '2025-12-11 17:23:39');
INSERT INTO `task_orders` VALUES ('o_1765445348658', 't_1', 'u_test', '朱墨染', 'approved', '', '2025-12-11 17:52:15', '2025-12-11 17:54:50', '2025-12-11 17:29:08');
INSERT INTO `task_orders` VALUES ('o_2', 't_1', 'u_002', '测试用户', 'submitted', NULL, NULL, NULL, '2025-12-11 16:55:04');
INSERT INTO `task_orders` VALUES ('o_3', 't_2', 'u_001', '朱墨染', 'approved', NULL, NULL, NULL, '2025-12-11 16:55:04');
INSERT INTO `task_orders` VALUES ('o_4', 't_3', 'u_002', '测试用户', 'pending', NULL, NULL, NULL, '2025-12-11 16:55:04');
INSERT INTO `task_orders` VALUES ('o_5', 't_4', 'u_001', '朱墨染', 'rejected', NULL, NULL, NULL, '2025-12-11 16:55:04');

-- ----------------------------
-- Table structure for tasks
-- ----------------------------
DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `price` decimal(10, 2) NULL DEFAULT 0.00,
  `unit` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '元/单',
  `type` enum('daily','bounty') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'daily',
  `location` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '线上',
  `tag` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `people_needed` int NULL DEFAULT 10,
  `publisher` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '平台发布',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'open',
  `work_date` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `work_period` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `publisher_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tasks
-- ----------------------------
INSERT INTO `tasks` VALUES ('t_1', 'APP注册下载1', '简单注册下载即可完成，秒审核', 9.00, '元/单', 'daily', '线上', '热门', 100, '', 'closed', '今日结算', '10分钟内完成', '2025-12-11 16:46:55', '2025-12-11 20:17:28', 'u_admin');
INSERT INTO `tasks` VALUES ('t_1765443197484', '1', '1', 10.00, '元/单', 'bounty', '线上', '1', 10, '平台发布', 'open', '', '', '2025-12-11 16:53:17', '2025-12-11 19:44:59', 'u_admin');
INSERT INTO `tasks` VALUES ('t_2', '游戏试玩体验', '下载游戏试玩5分钟，截图提交', 17.00, '元/单', 'bounty', '线上', '精选', 50, '赏金派单', 'open', '今日结算', '30分钟内完成', '2025-12-11 16:46:55', '2025-12-11 19:44:59', 'u_admin');
INSERT INTO `tasks` VALUES ('t_3', '直播点赞互动', '直播间在线点赞互动，完成截图提交', 25.00, '元/单', 'bounty', '线上', '直播', 50, '互动达人', 'open', '截止今日23:59', '30分钟内完成', '2025-12-11 16:46:55', '2025-12-11 19:44:59', 'u_admin');
INSERT INTO `tasks` VALUES ('t_4', '门店盘点录入', '到店进行商品盘点、数据录入，需签到打卡', 80.00, '元/天', 'daily', '线下', '日结', 3, '门店经理', 'open', '2025-12-12', '09:00-18:00', '2025-12-11 16:46:55', '2025-12-11 19:44:59', 'u_admin');
INSERT INTO `tasks` VALUES ('t_5', '地推扫码拉新', '商场/超市门口推广扫码，引导用户注册', 5.00, '元/人', 'daily', '线下', '地推', 20, '推广团队', 'closed', '今日结算', '09:00-21:00', '2025-12-11 16:46:55', '2025-12-11 19:44:59', 'u_admin');
INSERT INTO `tasks` VALUES ('t_6', '问卷调查填写', '在线完成问卷调查，约10分钟', 8.00, '元/份', 'bounty', '线上', '简单', 200, '调研中心', 'closed', '长期有效', '随时可做', '2025-12-11 16:46:55', '2025-12-11 19:44:59', 'u_admin');
INSERT INTO `tasks` VALUES ('t_7', '活动现场协助', '协助活动现场布置、签到引导、物料发放', 150.00, '元/天', 'daily', '线下', '活动', 10, '活动策划', 'open', '2025-12-15', '08:00-18:00', '2025-12-11 16:46:55', '2025-12-11 19:44:59', 'u_admin');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '新用户',
  `avatar` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '/static/avatar.png',
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '普通用户',
  `balance` decimal(10, 2) NULL DEFAULT 0.00,
  `points` int NULL DEFAULT 0,
  `level` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '普通会员',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'active',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `phone`(`phone` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('u_002', '13800138002', '123456', '测试用户', '/static/avatar.png', '普通用户', 800000.00, 100, '普通会员', 'active', '2025-12-11 16:46:55', '2025-12-11 17:56:34');
INSERT INTO `users` VALUES ('u_admin', '13800138000', '123456', '管理员', '/avatar.png', '管理员', 800000.00, 10000, '钻石会员', 'active', '2025-12-11 15:05:19', '2025-12-11 20:23:31');
INSERT INTO `users` VALUES ('u_test', '13800138001', '123456', '朱墨染', '/avatar-default.png', '普通用户', 800000.00, 2760, '银卡会员', 'active', '2025-12-11 15:05:19', '2025-12-11 20:23:31');

SET FOREIGN_KEY_CHECKS = 1;
