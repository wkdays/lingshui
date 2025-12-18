<template>
	<view class="container">
		<!-- Logo -->
		<view class="logo-section">
			<image class="logo" src="/static/logo.png" mode="aspectFit"></image>
			<text class="app-name">团餐订购</text>
			<text class="app-desc">健康饮食 美好生活</text>
		</view>
		
		<!-- 登录表单 -->
		<view class="form-section">
			<view class="input-group">
				<text class="input-icon">📱</text>
				<input 
					class="input" 
					type="number" 
					v-model="phone" 
					placeholder="请输入手机号" 
					maxlength="11" />
			</view>
			<view class="input-group">
				<text class="input-icon">🔒</text>
				<input 
					class="input" 
					type="text" 
					:password="true"
					v-model="password" 
					placeholder="请输入密码" />
			</view>
			
			<view class="login-btn" @click="login">登录</view>
		</view>
		
		<!-- 用户协议 -->
		<view class="agreement">
			<view class="check-box" @click="agreed = !agreed">
				<view class="check-icon" :class="{checked: agreed}">✓</view>
			</view>
			<text class="agreement-text">我已阅读并同意</text>
			<text class="agreement-link">《用户服务协议》</text>
			<text class="agreement-text">和</text>
			<text class="agreement-link">《隐私政策》</text>
		</view>
	</view>
</template>

<script>
import { userApi } from '@/api/mock.js'
import { setToken, setUser } from '@/utils/storage.js'
import store from '@/store/index.js'

export default {
	data() {
		return {
			phone: '',
			password: '',
			agreed: false
		}
	},
	methods: {
		async login() {
			if (!this.phone) {
				uni.showToast({ title: '请输入手机号', icon: 'none' })
				return
			}
			if (!this.password) {
				uni.showToast({ title: '请输入密码', icon: 'none' })
				return
			}
			if (!this.agreed) {
				uni.showToast({ title: '请阅读并同意用户协议', icon: 'none' })
				return
			}
			
			uni.showLoading({ title: '登录中...' })
			const res = await userApi.login({ phone: this.phone, password: this.password })
			uni.hideLoading()
			
			if (res.code === 0) {
				setToken(res.data.token)
				setUser(res.data.userInfo)
				store.setToken(res.data.token)
				store.setUserInfo(res.data.userInfo)
				uni.showToast({ title: '登录成功', icon: 'success' })
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
			} else {
				uni.showToast({ title: res.msg || '登录失败', icon: 'none' })
			}
		},
		wechatLogin() {
			if (!this.agreed) {
				uni.showToast({ title: '请阅读并同意用户协议', icon: 'none' })
				return
			}
			// 模拟微信登录
			uni.showLoading({ title: '登录中...' })
			setTimeout(async () => {
				const res = await userApi.login({ type: 'wechat' })
				uni.hideLoading()
				if (res.code === 0) {
					setToken(res.data.token)
					setUser(res.data.userInfo)
					store.setToken(res.data.token)
					store.setUserInfo(res.data.userInfo)
					uni.showToast({ title: '登录成功', icon: 'success' })
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				}
			}, 1000)
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: #fff;
	padding: 0 50rpx;
}

.logo-section {
	padding-top: 120rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 80rpx;
}

.logo {
	width: 160rpx;
	height: 160rpx;
	margin-bottom: 30rpx;
}

.app-name {
	font-size: 44rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 16rpx;
}

.app-desc {
	font-size: 28rpx;
	color: #999;
}

.form-section {
	padding: 0 20rpx;
}

.input-group {
	display: flex;
	align-items: center;
	background: #f5f5f5;
	border-radius: 50rpx;
	padding: 0 30rpx;
	margin-bottom: 30rpx;
}

.input-icon {
	font-size: 36rpx;
	margin-right: 20rpx;
}

.input {
	flex: 1;
	height: 100rpx;
	font-size: 30rpx;
}

.login-btn {
	margin-top: 40rpx;
	padding: 30rpx;
	background: linear-gradient(135deg, #4CD964 0%, #5AC8FA 100%);
	color: #fff;
	font-size: 34rpx;
	font-weight: bold;
	text-align: center;
	border-radius: 50rpx;
}

.quick-login {
	margin-top: 80rpx;
}

.divider {
	display: flex;
	align-items: center;
	margin-bottom: 40rpx;
}

.divider .line {
	flex: 1;
	height: 1rpx;
	background: #e5e5e5;
}

.divider .text {
	padding: 0 30rpx;
	font-size: 26rpx;
	color: #999;
}

.quick-btns {
	display: flex;
	justify-content: center;
}

.quick-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.quick-icon {
	font-size: 60rpx;
	margin-bottom: 12rpx;
}

.quick-text {
	font-size: 24rpx;
	color: #666;
}

.agreement {
	position: fixed;
	bottom: 60rpx;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	padding: 0 50rpx;
}

.check-box {
	margin-right: 10rpx;
}

.check-icon {
	width: 36rpx;
	height: 36rpx;
	border: 2rpx solid #ddd;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20rpx;
	color: transparent;
}

.check-icon.checked {
	background: #4CD964;
	border-color: #4CD964;
	color: #fff;
}

.agreement-text {
	font-size: 24rpx;
	color: #999;
}

.agreement-link {
	font-size: 24rpx;
	color: #4CD964;
}
</style>
