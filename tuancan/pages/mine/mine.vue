<template>
	<view class="container">
		<!-- 用户信息头部 -->
		<view class="header">
			<view class="user-info" @click="goLogin" v-if="!isLogin">
				<image class="avatar" src="/static/images/default-avatar.png" mode="aspectFill"></image>
				<view class="info">
					<text class="nickname">点击登录</text>
					<text class="desc">登录后享受更多服务</text>
				</view>
			</view>
			<view class="user-info" v-else>
				<image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
				<view class="info">
					<text class="nickname">{{userInfo.nickname}}</text>
					<text class="phone">{{userInfo.phone}}</text>
				</view>
			</view>
		</view>
		
		<!-- 余额卡片 -->
		<view class="balance-card" @click="goBalance">
			<view class="balance-left">
				<text class="balance-label">账户余额</text>
				<view class="balance-amount">
					<text class="symbol">¥</text>
					<text class="amount">{{balance.toFixed(2)}}</text>
				</view>
			</view>
		</view>
		
		<!-- 订单入口 -->
		<view class="order-section">
			<view class="section-header">
				<text class="section-title">我的订单</text>
				<text class="section-more" @click="goOrderList(-1)">全部订单 ›</text>
			</view>
			<view class="order-nav">
				<view class="nav-item" @click="goOrderList(0)">
					<view class="nav-icon">💳</view>
					<text class="nav-text">待支付</text>
				</view>
				<view class="nav-item" @click="goOrderList(1)">
					<view class="nav-icon">📦</view>
					<text class="nav-text">待发货</text>
				</view>
				<view class="nav-item" @click="goOrderList(3)">
					<view class="nav-icon">🚚</view>
					<text class="nav-text">配送中</text>
				</view>
				<view class="nav-item" @click="goOrderList(4)">
					<view class="nav-icon">✅</view>
					<text class="nav-text">已完成</text>
				</view>
			</view>
		</view>
		
		<!-- 功能列表 -->
		<view class="menu-list">
			<view class="menu-item" @click="goBalance">
				<text class="menu-icon">💰</text>
				<text class="menu-text">我的余额</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goTransactions">
				<text class="menu-icon">📊</text>
				<text class="menu-text">交易明细</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goMessages">
				<text class="menu-icon">🔔</text>
				<text class="menu-text">消息中心</text>
				<view class="menu-badge" v-if="unreadCount > 0">{{unreadCount}}</view>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goSpecial">
				<text class="menu-icon">🏷️</text>
				<text class="menu-text">特价专区</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goShopList">
				<text class="menu-icon">🏪</text>
				<text class="menu-text">商家列表</text>
				<text class="menu-arrow">›</text>
			</view>
		</view>
		
		<!-- 退出登录 -->
		<view class="logout-btn" v-if="isLogin" @click="logout">退出登录</view>
	</view>
</template>

<script>
import { userApi, messageApi } from '@/api/mock.js'
import store from '@/store/index.js'
import { getToken, getUser, removeToken, removeUser } from '@/utils/storage.js'

export default {
	data() {
		return {
			isLogin: false,
			userInfo: {},
			balance: 0,
			unreadCount: 0
		}
	},
	onShow() {
		this.checkLogin()
		if (this.isLogin) {
			this.loadUserInfo()
			this.loadUnreadCount()
		}
	},
	methods: {
		checkLogin() {
			const token = getToken()
			this.isLogin = !!token
			if (this.isLogin) {
				this.userInfo = getUser() || {}
			}
		},
		async loadUserInfo() {
			const res = await userApi.getUserInfo()
			if (res.code === 0) {
				this.userInfo = res.data
				this.balance = res.data.balance
			}
		},
		async loadUnreadCount() {
			const res = await messageApi.getMessages()
			if (res.code === 0) {
				this.unreadCount = res.data.filter(m => !m.read).length
			}
		},
		goLogin() {
			uni.navigateTo({ url: '/pages/login/login' })
		},
		goBalance() {
			uni.navigateTo({ url: '/pages/mine/balance' })
		},
		goTransactions() {
			uni.navigateTo({ url: '/pages/mine/transactions' })
		},
		goMessages() {
			uni.navigateTo({ url: '/pages/mine/messages' })
		},
		goSpecial() {
			uni.navigateTo({ url: '/pages/special/special' })
		},
		goShopList() {
			uni.navigateTo({ url: '/pages/shop/list' })
		},
		goOrderList(status) {
			uni.switchTab({ url: '/pages/order/list' })
		},
		logout() {
			uni.showModal({
				title: '提示',
				content: '确定退出登录？',
				success: (res) => {
					if (res.confirm) {
						removeToken()
						removeUser()
						store.logout()
						this.isLogin = false
						this.userInfo = {}
						this.balance = 0
						uni.showToast({ title: '已退出登录', icon: 'none' })
					}
				}
			})
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: #f5f5f5;
}

.header {
	background: linear-gradient(135deg, #34D399 0%, #10B981 100%);
	padding: 60rpx 40rpx 80rpx;
	padding-top: calc(60rpx + var(--status-bar-height));
}

.user-info {
	display: flex;
	align-items: center;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	border: 4rpx solid rgba(255,255,255,0.5);
	margin-right: 30rpx;
}

.info {
	flex: 1;
}

.nickname {
	font-size: 36rpx;
	color: #fff;
	font-weight: bold;
	display: block;
}

.desc, .phone {
	font-size: 26rpx;
	color: rgba(255,255,255,0.8);
	display: block;
	margin-top: 8rpx;
}

.balance-card {
	margin: -40rpx 24rpx 20rpx;
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08);
}

.balance-label {
	font-size: 26rpx;
	color: #999;
	display: block;
	margin-bottom: 10rpx;
}

.balance-amount {
	display: flex;
	align-items: baseline;
}

.symbol {
	font-size: 28rpx;
	color: #ff6b00;
	font-weight: bold;
}

.amount {
	font-size: 48rpx;
	color: #ff6b00;
	font-weight: bold;
}

.recharge-btn {
	padding: 18rpx 44rpx;
	background: linear-gradient(135deg, #34D399 0%, #10B981 100%);
	color: #fff;
	font-size: 28rpx;
	font-weight: 500;
	border-radius: 32rpx;
}

.order-section {
	margin: 20rpx 24rpx;
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}

.section-title {
	font-size: 30rpx;
	color: #333;
	font-weight: bold;
}

.section-more {
	font-size: 26rpx;
	color: #999;
}

.order-nav {
	display: flex;
	justify-content: space-around;
}

.nav-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.nav-icon {
	font-size: 48rpx;
	margin-bottom: 10rpx;
}

.nav-text {
	font-size: 26rpx;
	color: #666;
}

.menu-list {
	margin: 20rpx 24rpx;
	background: #fff;
	border-radius: 20rpx;
	overflow: hidden;
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 30rpx 24rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-icon {
	font-size: 40rpx;
	margin-right: 20rpx;
}

.menu-text {
	flex: 1;
	font-size: 30rpx;
	color: #333;
}

.menu-badge {
	background: #FF3B30;
	color: #fff;
	font-size: 22rpx;
	padding: 4rpx 12rpx;
	border-radius: 20rpx;
	margin-right: 10rpx;
}

.menu-arrow {
	font-size: 28rpx;
	color: #ccc;
}

.logout-btn {
	margin: 40rpx 24rpx;
	padding: 28rpx;
	background: #fff;
	border-radius: 20rpx;
	text-align: center;
	font-size: 30rpx;
	color: #FF3B30;
}
</style>
