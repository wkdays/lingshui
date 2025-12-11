<template>
  <view class="page">
    <view class="hero">
      <view class="logo-text">注册</view>
      <view class="subtitle">创建统一账号，畅通三端</view>
    </view>
    <view class="form">
      <view class="field">
        <text class="label">昵称</text>
        <input v-model="form.nickname" placeholder="请输入昵称" />
      </view>
      <view class="field">
        <text class="label">手机号</text>
        <input v-model="form.phone" placeholder="请输入手机号码" />
      </view>
      <view class="field">
        <text class="label">设置密码</text>
        <input v-model="form.password" type="password" placeholder="请输入密码" />
      </view>
      <view class="btn primary" @click="submit">注册并登录</view>
      <view class="links">
        <text @click="goLogin">已有账号去登录</text>
      </view>
    </view>
  </view>
</template>

<script>
import { authApi } from '../../config/api'

export default {
  data() {
    return {
      form: {
        nickname: '',
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
        const res = await authApi.register(this.form.phone, this.form.password, this.form.nickname)
        if (res.code === 0) {
          uni.setStorageSync('token', res.data.token)
          uni.setStorageSync('user', res.data.user)
          uni.showToast({ title: '注册成功', icon: 'success' })
          setTimeout(() => {
            uni.switchTab({ url: '/pages/index/index' })
          }, 1000)
        } else {
          uni.showToast({ title: res.message || '注册失败', icon: 'none' })
        }
      } catch (err) {
        uni.showToast({ title: '网络错误，请稍后重试', icon: 'none' })
      }
    },
    goLogin() {
      uni.navigateTo({ url: '/pages/auth/login' })
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
  padding: 18rpx;
  font-size: 28rpx;
  box-sizing: border-box;
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
}

.links {
  display: flex;
  justify-content: flex-end;
  margin-top: 16rpx;
  color: #3a7bff;
  font-size: 26rpx;
}
</style>
