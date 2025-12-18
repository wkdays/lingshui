<template>
	<view class="container">
		<!-- 用户信息区 -->
		<view class="user-area">
			<view class="user-info" @click="goLogin" v-if="!isLogin">
				<image src="/static/avatar-default.png" class="avatar"></image>
				<view class="user-text">
					<text class="nickname">点击登录</text>
					<text class="desc">登录后享受更多服务</text>
				</view>
			</view>
			<view class="user-info" v-else>
				<image :src="userInfo.avatar || '/static/avatar-default.png'" class="avatar"></image>
				<view class="user-text">
					<text class="nickname">{{userInfo.nickname}}</text>
					<text class="desc">{{userInfo.phone}}</text>
				</view>
			</view>
			
			<!-- 余额卡片 -->
			<view class="balance-card" @click="goBalance">
				<view class="balance-left">
					<text class="balance-label">账户余额</text>
					<text class="balance-value">{{isLogin ? `¥${Number(userInfo.balance || 0).toFixed(2)}` : '登录后查看'}}</text>
				</view>
				<view class="balance-right">
					<text class="balance-btn">充值</text>
				</view>
			</view>
		</view>
		
		<!-- 订单区域 -->
		<view class="order-section">
			<view class="section-header">
				<text class="section-title">我的订单</text>
				<text class="section-more" @click="goOrders(0)">全部订单 ›</text>
			</view>
			<view class="order-tabs">
				<view class="order-tab" @click="goOrders(1)">
					<text class="tab-icon">💳</text>
					<text class="tab-text">待支付</text>
				</view>
				<view class="order-tab" @click="goOrders(2)">
					<text class="tab-icon">📦</text>
					<text class="tab-text">待发货</text>
				</view>
				<view class="order-tab" @click="goOrders(3)">
					<text class="tab-icon">🚚</text>
					<text class="tab-text">待收货</text>
				</view>
				<view class="order-tab" @click="goOrders(5)">
					<text class="tab-icon">✅</text>
					<text class="tab-text">已完成</text>
				</view>
			</view>
		</view>
		
		<!-- 功能列表 -->
		<view class="menu-section">
			<view class="menu-item" @click="goBalance">
				<text class="menu-icon">💰</text>
				<text class="menu-text">我的余额</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goTransactions">
				<text class="menu-icon">📝</text>
				<text class="menu-text">交易明细</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goMessages">
				<text class="menu-icon">🔔</text>
				<text class="menu-text">消息中心</text>
				<view class="badge" v-if="unreadCount">{{unreadCount}}</view>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goAddress">
				<text class="menu-icon">📍</text>
				<text class="menu-text">收货地址</text>
				<text class="menu-arrow">›</text>
			</view>
		</view>
		
		<button class="logout-btn" v-if="isLogin" @click="handleLogout">退出登录</button>
		
		<!-- 自定义tabbar -->
		<custom-tabbar :current="3"></custom-tabbar>
	</view>
</template>

<script>
import api from '@/api/index.js'
import storage from '@/utils/storage.js'
import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue'

export default {
	components: {
		CustomTabbar
	},
	data() {
		return {
			isLogin: false,
			userInfo: {},
			unreadCount: 0
		}
	},
	onShow() {
		this.checkLogin()
	},
	methods: {
		checkLogin() {
			const token = storage.getToken()
			this.isLogin = !!token
			if (this.isLogin) {
				this.loadUserInfo()
				this.loadMessages()
			} else {
				this.userInfo = {}
			}
		},
		async loadUserInfo() {
			const res = await api.getUserInfo()
			if (res.code === 0 && res.data) {
				this.userInfo = res.data
				return
			}
			const localUser = storage.getUserInfo()
			this.userInfo = localUser || { balance: storage.getBalance() }
		},
		async loadMessages() {
			const res = await api.getMessages()
			this.unreadCount = res.data.filter(m => !m.read).length
		},
		goLogin() {
			uni.navigateTo({ url: '/pages/login/login' })
		},
		goBalance() {
			if (!this.isLogin) {
				this.goLogin()
				return
			}
			uni.navigateTo({ url: '/pages/balance/balance' })
		},
		goTransactions() {
			if (!this.isLogin) {
				this.goLogin()
				return
			}
			uni.navigateTo({ url: '/pages/balance/transactions' })
		},
		goMessages() {
			if (!this.isLogin) {
				this.goLogin()
				return
			}
			uni.navigateTo({ url: '/pages/message/message' })
		},
		goAddress() {
			if (!this.isLogin) {
				this.goLogin()
				return
			}
			uni.navigateTo({ url: '/pages/address/list' })
		},
		goOrders(status) {
			if (!this.isLogin) {
				this.goLogin()
				return
			}
			uni.navigateTo({ url: '/pages/order/list?status=' + status })
		},
		handleLogout() {
			uni.showModal({
				title: '提示',
				content: '确定退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						storage.clearAll()
						this.isLogin = false
						this.userInfo = {}
						uni.showToast({ title: '已退出登录', icon: 'success' })
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
	padding-bottom: 160rpx;
}
.user-area {
	padding: 50rpx 30rpx 40rpx;
	position: relative;
	overflow: hidden;
	background: #111;
}
.user-area::before {
	content: '';
	position: absolute;
	top: -100rpx;
	right: -100rpx;
	width: 300rpx;
	height: 300rpx;
	background: rgba(255,255,255,0.1);
	border-radius: 50%;
}
.user-area::after {
	content: '';
	position: absolute;
	bottom: -50rpx;
	left: -50rpx;
	width: 200rpx;
	height: 200rpx;
	background: rgba(255,255,255,0.08);
	border-radius: 50%;
}
.user-info {
	display: flex;
	align-items: center;
	position: relative;
	z-index: 1;
}
.avatar {
	width: 140rpx;
	height: 140rpx;
	border-radius: 50%;
	border: 6rpx solid rgba(255,255,255,0.4);
	box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.15);
}
.user-text {
	margin-left: 28rpx;
}
.nickname {
	font-size: 40rpx;
	color: #fff;
	font-weight: bold;
	display: block;
	text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}
.desc {
	font-size: 26rpx;
	color: rgba(255,255,255,0.9);
	margin-top: 10rpx;
	display: block;
}
.balance-card {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: rgba(255,255,255,0.25);
	backdrop-filter: blur(10px);
	border-radius: 20rpx;
	padding: 28rpx;
	margin-top: 36rpx;
	position: relative;
	z-index: 1;
	border: 1rpx solid rgba(255,255,255,0.3);
}
.balance-label {
	font-size: 26rpx;
	color: rgba(255,255,255,0.9);
	display: block;
}
.balance-value {
	font-size: 52rpx;
	color: #fff;
	font-weight: bold;
	margin-top: 10rpx;
	display: block;
	text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}
.balance-btn {
	background: #fff;
	color: #111;
	padding: 16rpx 40rpx;
	border-radius: 36rpx;
	font-size: 28rpx;
	font-weight: 500;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.1);
}
.order-section {
	background: #fff;
	margin: -30rpx 20rpx 20rpx;
	border-radius: 20rpx;
	padding: 28rpx;
	position: relative;
	z-index: 2;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.06);
}
.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 28rpx;
}
.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}
.section-more {
	font-size: 26rpx;
	color: #999;
	padding: 6rpx 16rpx;
	background: #f8f8f8;
	border-radius: 20rpx;
}
.order-tabs {
	display: flex;
	justify-content: space-around;
}
.order-tab {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 16rpx 24rpx;
	border-radius: 16rpx;
	transition: all 0.2s;
}
.order-tab:active {
	background: #f5f5f5;
	transform: scale(0.95);
}
.tab-icon {
	font-size: 52rpx;
}
.tab-text {
	font-size: 24rpx;
	color: #666;
	margin-top: 14rpx;
	font-weight: 500;
}
.menu-section {
	background: #fff;
	margin: 20rpx;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
	overflow: hidden;
}
.menu-item {
	display: flex;
	align-items: center;
	padding: 34rpx 28rpx;
	border-bottom: 1rpx solid #f5f5f5;
	transition: background 0.2s;
}
.menu-item:active {
	background: #fafafa;
}
.menu-item:last-child {
	border-bottom: none;
}
.menu-icon {
	font-size: 44rpx;
	margin-right: 24rpx;
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f3f3f3;
	border-radius: 14rpx;
}
.menu-text {
	flex: 1;
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
}
.badge {
	background: #111;
	color: #fff;
	font-size: 20rpx;
	padding: 6rpx 14rpx;
	border-radius: 20rpx;
	margin-right: 16rpx;
	font-weight: bold;
}
.menu-arrow {
	font-size: 28rpx;
	color: #ccc;
}
.logout-btn {
	margin: 40rpx 20rpx 40rpx;
	background: #fff;
	color: #FF4444;
	border: 2rpx solid #FF4444;
	border-radius: 48rpx;
	font-size: 30rpx;
	height: 96rpx;
	line-height: 96rpx;
	font-weight: 500;
}
.logout-btn:active {
	background: #FFF5F5;
}
</style>
