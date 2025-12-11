<template>
  <view class="page">
    <!-- 顶部区域：Logo + 搜索框 -->
    <view class="top-bg" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="top-bar">
        <image class="logo" src="/static/logo.png" mode="aspectFit" />
        <text class="app-title">陵水数投数字经济供应链</text>
      </view>
      
      <!-- 轮播图 -->
      <swiper class="banner" circular indicator-dots autoplay interval="4000">
        <swiper-item v-for="item in homeData.banners" :key="item.id" @click="onBannerClick(item)">
          <view class="banner-item" :style="item.imageUrl ? {} : { background: `linear-gradient(135deg, ${item.gradient ? item.gradient[0] : '#3a7bff'}, ${item.gradient ? item.gradient[1] : '#5a9dff'})` }">
            <image v-if="item.imageUrl" class="banner-bg-image" :src="item.imageUrl" mode="aspectFill" />
            <view class="banner-content">
              <view class="banner-title">{{ item.title }}</view>
              <view class="banner-desc">{{ item.desc }}</view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 公告通知栏 -->
    <view class="notice-bar" v-if="homeData.announcements && homeData.announcements.length > 0" @click="goAnnouncements">
      <text class="notice-icon">📢</text>
      <swiper class="notice-swiper" vertical autoplay circular interval="3000">
        <swiper-item v-for="item in homeData.announcements" :key="item.id">
          <text class="notice-text">{{ item.title }}</text>
        </swiper-item>
      </swiper>
      <text class="notice-more">更多 ›</text>
    </view>

    <!-- 快捷导航：赚钱、团餐、团购、住房 -->
    <view class="quick-nav">
      <view v-for="nav in quickNavList" :key="nav.id" class="quick-item" @click="openQuick(nav)">
        <text class="quick-text">{{ nav.label }}</text>
      </view>
    </view>

    <!-- 任务类型卡片：日结单、赏金单 -->
    <view class="task-type-row">
      <view class="task-type-card daily" @click="goSquare('daily')">
        <text class="type-title">日结单</text>
      </view>
      <view class="task-type-card bounty" @click="goSquare('bounty')">
        <text class="type-title">赏金单</text>
      </view>
    </view>

    <!-- 任务分类标签 -->
    <view class="section-header">
      <text class="section-title">任务广场</text>
      <text class="section-more" @click="goSquare('')">查看全部 ›</text>
    </view>
    
    <scroll-view class="filter-scroll" scroll-x>
      <view
        v-for="(item, idx) in filterList"
        :key="item"
        class="filter-chip"
        :class="{ active: currentFilter === idx }"
        @click="currentFilter = idx"
      >
        {{ item }}
      </view>
    </scroll-view>

    <!-- 任务列表 -->
    <view class="task-list">
      <view v-for="task in taskList" :key="task.id" class="task-card" @click="goDetail(task.id)">
        <view class="task-header">
          <text class="task-tag" :class="task.type">{{ task.type === 'daily' ? '日结' : '赏金' }}</text>
          <text class="task-title">{{ task.title }}</text>
        </view>
        <text class="task-desc">{{ task.desc }}</text>
        <view class="task-footer">
          <view class="task-price">
            <text class="price-num">¥{{ task.price }}</text>
            <text class="price-unit">{{ task.unit || '/单' }}</text>
          </view>
          <view class="task-info">
            <text class="task-location">📍 {{ task.location || '线上' }}</text>
            <text class="task-people">👥 需{{ task.peopleNeeded || 10 }}人</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { fetchHome } from '../../mock/api'

export default {
  data() {
    return {
      statusBarHeight: 20,
      currentFilter: 0,
      homeData: {
        banners: [],
        simpleTasks: [],
        bountyTasks: [],
      },
      quickNavList: [
        { id: 'groupon', label: '团购', target: 'mini-groupon' },
        { id: 'travel', label: '旅游', target: 'mini-travel' },
        { id: 'catering', label: '团餐', target: 'mini-catering' },
      ],
      filterList: ['全部', '软件助力', '简单关注', '人脉拓展', '筛选'],
    }
  },
  computed: {
    taskList() {
      const all = [...(this.homeData.simpleTasks || []), ...(this.homeData.bountyTasks || [])]
      if (this.currentFilter === 0) return all
      return all
    }
  },
  async onLoad() {
    const info = uni.getSystemInfoSync()
    this.statusBarHeight = info.statusBarHeight || 20
    await this.loadData()
  },
  onPullDownRefresh() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const res = await fetchHome()
      this.homeData = res.data
      uni.stopPullDownRefresh()
    },
    goDetail(id) {
      uni.navigateTo({ url: `/pages/task/detail?id=${id}` })
    },
    goSquare(type) {
      uni.navigateTo({ url: `/pages/task/square?type=${type}` })
    },
    openQuick(nav) {
      uni.showToast({ title: `${nav.label}入口已预留`, icon: 'none' })
    },
    onBannerClick(item) {
      if (item.link) {
        uni.navigateTo({ url: item.link })
      }
    },
    goAnnouncements() {
      uni.navigateTo({ url: '/pages/announcements/index' })
    },
  },
}
</script>

<style>
.page {
  background: #f5f7fb;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

.top-bg {
  background: linear-gradient(180deg, #2f6dff, #5a9dff);
  padding: 20rpx 24rpx 40rpx;
}

.top-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.notice-bar {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 30rpx;
  padding: 12rpx 20rpx;
  margin: 20rpx 24rpx 0;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}

.notice-icon {
  font-size: 28rpx;
  margin-right: 10rpx;
}

.notice-swiper {
  flex: 1;
  height: 36rpx;
}

.notice-text {
  font-size: 26rpx;
  color: #333;
  line-height: 36rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notice-more {
  font-size: 24rpx;
  color: #999;
  margin-left: 10rpx;
}

.logo {
  width: 60rpx;
  height: 60rpx;
}

.app-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
  margin-left: 12rpx;
}

.banner {
  height: 240rpx;
  margin-top: 24rpx;
}

.banner-item {
  height: 240rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

.banner-bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 20rpx;
}

.banner-content {
  position: relative;
  z-index: 1;
}

.banner-title {
  font-size: 44rpx;
  font-weight: 700;
  color: #fff;
}

.banner-desc {
  margin-top: 16rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
}

.banner-img {
  width: 200rpx;
  height: 200rpx;
}

.quick-nav {
  margin: 20rpx 24rpx 0;
  display: flex;
  gap: 16rpx;
}

.quick-item {
  flex: 1;
  height: 80rpx;
  background: #fff;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
  border: 2rpx solid #eef0f6;
}

.quick-text {
  font-size: 28rpx;
  color: #2f3440;
  font-weight: 500;
}

.task-type-row {
  margin: 20rpx 24rpx 0;
  display: flex;
  gap: 16rpx;
}

.task-type-card {
  flex: 1;
  height: 160rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-type-card.daily {
  background: linear-gradient(135deg, #2f6dff, #5a9dff);
}

.task-type-card.bounty {
  background: linear-gradient(135deg, #2f6dff, #5a9dff);
}

.type-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30rpx 24rpx 0;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1f2430;
}

.section-more {
  font-size: 26rpx;
  color: #999;
}

.filter-scroll {
  margin-top: 20rpx;
  padding: 0 24rpx;
  white-space: nowrap;
}

.filter-chip {
  display: inline-flex;
  padding: 14rpx 28rpx;
  background: #fff;
  color: #4f5b71;
  border-radius: 8rpx;
  font-size: 26rpx;
  margin-right: 16rpx;
  border: 2rpx solid #eef0f6;
}

.filter-chip.active {
  background: #2f6dff;
  color: #fff;
  border-color: #2f6dff;
}

.task-list {
  margin: 20rpx 24rpx 0;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.task-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.06);
}

.task-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.task-tag {
  font-size: 22rpx;
  padding: 6rpx 14rpx;
  border-radius: 6rpx;
  font-weight: 500;
}

.task-tag.daily {
  background: #e6f7ff;
  color: #1890ff;
}

.task-tag.bounty {
  background: #fff7e6;
  color: #fa8c16;
}

.task-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1f2430;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-desc {
  font-size: 26rpx;
  color: #8a94a6;
  margin-top: 12rpx;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16rpx;
}

.task-price {
  display: flex;
  align-items: baseline;
}

.price-num {
  font-size: 36rpx;
  font-weight: 700;
  color: #ff4d4f;
}

.price-unit {
  font-size: 22rpx;
  color: #8a94a6;
  margin-left: 4rpx;
}

.task-info {
  display: flex;
  gap: 20rpx;
}

.task-location, .task-people {
  font-size: 22rpx;
  color: #8a94a6;
}
</style>
