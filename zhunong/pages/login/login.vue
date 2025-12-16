<template>
	<view class="container">
		<view class="logo-area">
			<image src="/static/logo.png" mode="aspectFit" class="logo"></image>
			<text class="app-name">社区团购</text>
		</view>
		
		<view class="form-area">
			<view class="input-item">
				<text class="input-icon">📱</text>
				<input type="text" v-model="phone" placeholder="请输入手机号" maxlength="11" />
			</view>
			<view class="input-item">
				<text class="input-icon">🔒</text>
				<input type="password" :password="true" v-model="password" placeholder="请输入密码" />
			</view>
			
			<button class="login-btn" @tap="handleLogin">登录</button>
		</view>
		
		<view class="agreement">
			<checkbox-group @change="onAgreeChange">
				<label>
					<checkbox value="1" :checked="agreed" />
					<text>我已阅读并同意</text>
					<text class="link">《用户协议》</text>
					<text>和</text>
					<text class="link">《隐私政策》</text>
				</label>
			</checkbox-group>
		</view>
	</view>
</template>

<script>
import api from '@/api/index.js'
import storage from '@/utils/storage.js'

export default {
	data() {
		return {
			phone: '',
			password: '',
			agreed: false
		}
	},
	methods: {
		onAgreeChange(e) {
			const values = e?.detail?.value || []
			this.agreed = Array.isArray(values) && values.length > 0
		},
		async handleLogin() {
			if (!this.phone || !this.password) {
				uni.showToast({ title: '请输入手机号和密码', icon: 'none' })
				return
			}
			if (!this.agreed) {
				uni.showToast({ title: '请先同意用户协议', icon: 'none' })
				return
			}
			
			uni.showLoading({ title: '登录中...' })
			try {
				const res = await api.login({ phone: this.phone, password: this.password })
				if (res && res.code === 0) {
					// API内部已保存到storage
					uni.showToast({ title: '登录成功', icon: 'success' })
					setTimeout(() => {
						uni.switchTab({ url: '/pages/index/index' })
					}, 1500)
					return
				}
				const message = (res && (res.message || res.msg)) || '登录失败'
				console.warn('login failed:', res)
				uni.showModal({
					title: '登录失败',
					content: message,
					showCancel: false
				})
			} catch (e) {
				console.error(e)
				uni.showModal({ title: '登录异常', content: String(e?.message || e), showCancel: false })
			} finally {
				uni.hideLoading()
			}
		},
		wechatLogin() {
			if (!this.agreed) {
				uni.showToast({ title: '请先同意用户协议', icon: 'none' })
				return
			}
			// 模拟微信登录
			uni.showLoading({ title: '登录中...' })
			setTimeout(async () => {
				const res = await api.login({ phone: '13800138000' })
				uni.hideLoading()
				uni.showToast({ title: '登录成功', icon: 'success' })
				setTimeout(() => {
					uni.switchTab({ url: '/pages/index/index' })
				}, 1500)
			}, 1000)
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: #f5f5f5;
	padding: 100rpx 40rpx 60rpx;
}
.logo-area {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 80rpx;
}
.logo {
	width: 180rpx;
	height: 180rpx;
	border-radius: 36rpx;
	box-shadow: 0 12rpx 40rpx rgba(255,107,53,0.2);
}
.app-name {
	font-size: 44rpx;
	font-weight: bold;
	color: #111;
	margin-top: 28rpx;
	letter-spacing: 4rpx;
}
.form-area {
	padding: 0 20rpx;
	background: #fff;
	border-radius: 24rpx;
	padding: 40rpx 30rpx;
	box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.06);
}
.input-item {
	display: flex;
	align-items: center;
	background: #f3f3f3;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 24rpx;
}
.input-icon {
	font-size: 40rpx;
	margin-right: 20rpx;
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #fff;
	border-radius: 12rpx;
}
.input-item input {
	flex: 1;
	font-size: 30rpx;
}
.login-btn {
	background: #111;
	color: #fff;
	border: none;
	border-radius: 48rpx;
	height: 96rpx;
	line-height: 96rpx;
	font-size: 34rpx;
	font-weight: 500;
	margin-top: 40rpx;
	box-shadow: 0 12rpx 28rpx rgba(0,0,0,0.18);
}
.login-btn:active {
	transform: scale(0.98);
	opacity: 0.9;
}
.other-login {
	margin-top: 60rpx;
}
.divider {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 40rpx;
}
.divider .line {
	width: 120rpx;
	height: 2rpx;
	background: linear-gradient(90deg, transparent, #ddd);
}
.divider .line:last-child {
	background: linear-gradient(90deg, #ddd, transparent);
}
.divider text {
	font-size: 26rpx;
	color: #999;
	margin: 0 24rpx;
}
.wechat-btn {
	background: #fff;
	color: #111;
	border: 2rpx solid rgba(0,0,0,0.12);
	border-radius: 48rpx;
	height: 96rpx;
	line-height: 96rpx;
	font-size: 34rpx;
	font-weight: 500;
	box-shadow: none;
}
.wechat-btn:active {
	transform: scale(0.98);
	opacity: 0.9;
}
.agreement {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
	margin-top: 60rpx;
	font-size: 24rpx;
	color: #999;
}
.agreement .link {
	color: #111;
	font-weight: 500;
}
</style>
