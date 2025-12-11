<template>
  <view class="page">
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-actions">
        <view class="icon-btn" @click="goMessages">
          <image class="icon-img" src="/static/ic-bell.png" mode="aspectFit" />
        </view>
        <view class="icon-btn" @click="goAnnouncements">
          <image class="icon-img" src="/static/ic-info.png" mode="aspectFit" />
        </view>
      </view>
      <view class="user-row">
        <image class="avatar" :src="isLoggedIn ? user.avatar : '/static/avatar-default.png'" mode="aspectFill" />
        <view class="user-info">
          <view class="name">{{ user.nickname }}</view>
          <view class="tags" v-if="isLoggedIn">
            <text class="tag">{{ user.role }}</text>
            <text class="tag">等级 {{ user.level }}</text>
          </view>
          <view class="phone" v-if="isLoggedIn">账号：{{ user.phone }}</view>
        </view>
        <view class="login-btn" @click="isLoggedIn ? logout() : goLogin()">{{ isLoggedIn ? '退出登录' : '立即登录' }}</view>
      </view>
      <view class="wallet-row">
        <view class="wallet-item full">
          <view class="wallet-label">虚拟储值卡余额(元)</view>
          <view class="wallet-value">￥{{ user.balance }}</view>
        </view>
      </view>
    </view>

    <view class="card stats">
      <view class="stat-item" @click="goMyPublished">
        <view class="stat-num">{{ user.publishedCount }}</view>
        <view class="stat-label">我发的单</view>
      </view>
      <view class="stat-item" @click="goMyReceived">
        <view class="stat-num">{{ user.receivedCount }}</view>
        <view class="stat-label">我接的单</view>
      </view>
      <view class="stat-item" @click="goHistory">
        <view class="stat-num">{{ user.finishedCount }}</view>
        <view class="stat-label">历史记录</view>
      </view>
    </view>

    <view class="card">
      <view class="section-title">更多服务</view>
      <view class="service-grid">
        <view
          v-for="item in services"
          :key="item.id"
          class="service-item"
          @click="openService(item)"
        >
          <view class="service-icon" :style="{ backgroundColor: item.color }">
            <text class="service-initial">{{ item.label.slice(0, 2) }}</text>
          </view>
          <view class="service-text">{{ item.label }}</view>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import { authApi } from '../../config/api'

export default {
  data() {
    return {
      statusBarHeight: 20,
      isLoggedIn: false,
      user: {
        nickname: '立即登录',
        avatar: '/static/avatar.png',
        balance: 0,
        points: 0,
        publishedCount: 0,
        receivedCount: 0,
        finishedCount: 0,
        level: '普通',
        phone: '--',
        role: '普通用户',
      },
      services: [
        { id: 'messages', label: '消息中心', color: '#e6f0ff', path: '/pages/messages/index' },
        { id: 'announcements', label: '系统公告', color: '#fdf2e6', path: '/pages/announcements/index' },
      ],
    }
  },
  async onShow() {
    const info = uni.getSystemInfoSync()
    this.statusBarHeight = info.statusBarHeight || 20
    await this.loadUser()
  },
  methods: {
    async loadUser() {
      const token = uni.getStorageSync('token')
      if (!token) {
        this.isLoggedIn = false
        return
      }
      try {
        const res = await authApi.getProfile()
        if (res.code === 0) {
          this.user = { ...this.user, ...res.data, phone: res.data.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') }
          this.isLoggedIn = true
                  } else {
          uni.removeStorageSync('token')
          this.isLoggedIn = false
        }
      } catch (err) {
        // 网络错误时使用本地缓存
        const cachedUser = uni.getStorageSync('user')
        if (cachedUser) {
          this.user = { ...this.user, ...cachedUser }
          this.isLoggedIn = true
          }
      }
    },
    goMessages() {
      uni.navigateTo({ url: '/pages/messages/index' })
    },
    goAnnouncements() {
      uni.navigateTo({ url: '/pages/announcements/index' })
    },
    goLogin() {
      uni.navigateTo({ url: '/pages/auth/login' })
    },
    goMyPublished() {
      uni.navigateTo({ url: '/pages/task/my-published' })
    },
    goMyReceived() {
      uni.navigateTo({ url: '/pages/task/my-received' })
    },
    goHistory() {
      uni.navigateTo({ url: '/pages/task/history' })
    },
    openService(item) {
      if (item.path) {
        uni.navigateTo({ url: item.path })
      } else {
        uni.showToast({ title: '已预留接口', icon: 'none' })
      }
    },
    logout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync('token')
            uni.removeStorageSync('user')
            this.isLoggedIn = false
            this.user = {
              nickname: '立即登录',
              avatar: '/static/avatar.png',
              balance: 0,
              points: 0,
              publishedCount: 0,
              receivedCount: 0,
              finishedCount: 0,
              level: '普通',
              phone: '--',
              role: '普通用户',
            }
            uni.showToast({ title: '已退出登录', icon: 'none' })
          }
        }
      })
    },
  },
}
</script>

<style>
.page {
  min-height: 100vh;
  background: #f5f7fb;
  padding-bottom: 40rpx;
}

.header {
  background: #2f6dff;
  color: #fff;
  padding: 20rpx 24rpx 26rpx;
  border-bottom-left-radius: 26rpx;
  border-bottom-right-radius: 26rpx;
}

.header-actions {
  display: flex;
  justify-content: flex-end;
}

.icon-btn {
  width: 64rpx;
  height: 64rpx;
  background: rgba(255, 255, 255, 0.22);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12rpx;
  font-size: 30rpx;
}

.icon-img {
  width: 32rpx;
  height: 32rpx;
}

.user-row {
  display: flex;
  align-items: center;
  margin-top: 16rpx;
}

.avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  border: 4rpx solid #ffffff50;
}

.user-info {
  flex: 1;
  margin-left: 16rpx;
}

.name {
  font-size: 32rpx;
  font-weight: 700;
}

.tags {
  display: flex;
  margin-top: 8rpx;
}

.tag {
  background: rgba(255, 255, 255, 0.18);
  padding: 6rpx 12rpx;
  border-radius: 14rpx;
  font-size: 22rpx;
  margin-right: 10rpx;
}

.phone {
  margin-top: 6rpx;
  font-size: 24rpx;
  opacity: 0.9;
}

.login-btn {
  padding: 12rpx 18rpx;
  background: #f8fbff;
  color: #2f6dff;
  border-radius: 20rpx;
  font-size: 24rpx;
}

.wallet-row {
  margin-top: 18rpx;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 16rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 14rpx;
  gap: 12rpx;
}

.wallet-item {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 12rpx;
  padding: 10rpx 12rpx;
}

.wallet-item.full {
  grid-column: 1 / -1;
  text-align: center;
  padding: 20rpx;
}

.wallet-label {
  font-size: 22rpx;
  opacity: 0.9;
}

.wallet-value {
  font-size: 30rpx;
  font-weight: 700;
  margin-top: 6rpx;
}

.wallet-action {
  margin-top: 6rpx;
  font-size: 22rpx;
  color: #e6f0ff;
}

.card {
  background: #fff;
  margin: 20rpx 24rpx 0;
  border-radius: 20rpx;
  padding: 18rpx;
  box-shadow: 0 10rpx 24rpx rgba(0, 0, 0, 0.05);
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
}

.stat-item {
  padding: 14rpx 6rpx;
}

.stat-num {
  font-size: 34rpx;
  font-weight: 700;
  color: #2f6dff;
}

.stat-label {
  margin-top: 8rpx;
  color: #7a8299;
  font-size: 24rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1f2430;
}

.row-actions {
  display: flex;
  margin-top: 14rpx;
}

.row-item {
  flex: 1;
  background: #f5f7fb;
  margin-right: 10rpx;
  border-radius: 16rpx;
  padding: 14rpx 12rpx;
  display: flex;
  align-items: center;
}

.row-item:last-child {
  margin-right: 0;
}

.row-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #2f6dff;
  margin-right: 10rpx;
}

.row-text {
  font-size: 26rpx;
  color: #2f3440;
}

.banner {
  margin-top: 16rpx;
  background: linear-gradient(90deg, #3a7bff, #4ad17a);
  color: #fff;
  border-radius: 18rpx;
  padding: 18rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.banner-title {
  font-size: 30rpx;
  font-weight: 700;
}

.banner-desc {
  font-size: 24rpx;
  opacity: 0.9;
}

.banner-arrow {
  font-size: 34rpx;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18rpx 12rpx;
  margin-top: 14rpx;
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.service-icon {
  width: 82rpx;
  height: 82rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-initial {
  font-size: 28rpx;
  color: #1f2430;
}

.service-text {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #4f5b71;
}

.service-icon.admin {
  border: 2rpx solid #2f6dff;
}

.debug-card {
  margin-top: 20rpx;
}

.debug-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10rpx 0;
  font-size: 28rpx;
  color: #4f5b71;
}

.debug-status {
  color: #2f6dff;
  font-weight: 600;
}
</style>
