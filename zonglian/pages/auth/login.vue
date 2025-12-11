<template>
  <view class="page">
    <view class="hero">
      <view class="logo-text">登录</view>
      <view class="subtitle">陵水数投数字经济供应链</view>
    </view>
    <view class="form">
      <view class="field">
        <text class="label">手机号</text>
        <input v-model="form.phone" placeholder="请输入手机号码" />
      </view>
      <view class="field">
        <text class="label">密码</text>
        <input v-model="form.password" password placeholder="请输入密码" />
      </view>
      <view class="btn primary" @click="submit">立即登录</view>
    </view>
  </view>
</template>

<script>
import { authApi } from '../../config/api'

export default {
  data() {
    return {
      form: {
        phone: '',
        password: '',
      },
    }
  },
  methods: {
    async submit() {
      if (!this.form.phone || !this.form.password) {
        uni.showToast({ title: '请输入手机号和密码', icon: 'none' })
        return
      }
      try {
        const res = await authApi.login(this.form.phone, this.form.password)
        if (res.code === 0) {
          uni.setStorageSync('token', res.data.token)
          uni.setStorageSync('user', res.data.user)
          uni.showToast({ title: '登录成功', icon: 'success' })
          setTimeout(() => {
            uni.switchTab({ url: '/pages/index/index' })
          }, 1000)
        } else {
          uni.showToast({ title: res.message || '登录失败', icon: 'none' })
        }
      } catch (err) {
        uni.showToast({ title: '网络错误，请稍后重试', icon: 'none' })
      }
    },
  },
}
</script>

<style>
.page {
  background: #f5f7fb;
  min-height: 100vh;
}

.hero {
  background: linear-gradient(120deg, #2f6dff, #6ca7ff);
  padding: 120rpx 40rpx 80rpx;
  color: #fff;
  border-bottom-left-radius: 30rpx;
  border-bottom-right-radius: 30rpx;
}

.logo-text {
  font-size: 44rpx;
  font-weight: 700;
}

.subtitle {
  margin-top: 12rpx;
  font-size: 26rpx;
  opacity: 0.9;
}

.form {
  background: #fff;
  margin: -60rpx 24rpx 0;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 12rpx 30rpx rgba(0, 0, 0, 0.08);
}

.field {
  margin-bottom: 20rpx;
}

.label {
  display: block;
  color: #7a8299;
  font-size: 24rpx;
  margin-bottom: 8rpx;
}

input {
  width: 100%;
  background: #f5f7fb;
  border-radius: 14rpx;
  padding: 28rpx 20rpx;
  font-size: 30rpx;
  box-sizing: border-box;
  height: 90rpx;
}

.btn {
  width: 100%;
  text-align: center;
  border-radius: 28rpx;
  padding: 18rpx 0;
  margin-top: 10rpx;
  font-size: 30rpx;
}

.primary {
  background: linear-gradient(120deg, #2f6dff, #6ca7ff);
  color: #fff;
  font-weight: 600;
  margin-top: 30rpx;
}
</style>
