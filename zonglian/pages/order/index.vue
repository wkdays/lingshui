<template>
  <view class="page">
    <view class="header">
      <text class="title">我的订单</text>
    </view>
    <view class="tabs">
      <text class="tab" :class="{ active: currentTab === 0 }" @click="currentTab = 0">全部</text>
      <text class="tab" :class="{ active: currentTab === 1 }" @click="currentTab = 1">进行中</text>
      <text class="tab" :class="{ active: currentTab === 2 }" @click="currentTab = 2">已完成</text>
    </view>
    <view class="order-list">
      <view class="order-item" v-for="item in orderList" :key="item.id">
        <view class="order-top">
          <text class="order-title">{{ item.title }}</text>
          <text class="order-status" :class="item.statusClass">{{ item.status }}</text>
        </view>
        <text class="order-desc">{{ item.desc }}</text>
        <view class="order-bottom">
          <text class="order-price">¥{{ item.price }}</text>
          <text class="order-time">{{ item.time }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 0,
      orderList: [
        { id: 1, title: 'APP注册下载', desc: '简单注册下载即可完成', price: 9, status: '进行中', statusClass: 'pending', time: '2025-12-11' },
        { id: 2, title: '游戏试玩体验', desc: '下载游戏试玩5分钟', price: 17, status: '已完成', statusClass: 'done', time: '2025-12-10' },
        { id: 3, title: '直播点赞互动', desc: '直播间在线点赞互动', price: 25, status: '待审核', statusClass: 'review', time: '2025-12-09' },
      ]
    }
  }
}
</script>

<style>
.page {
  min-height: 100vh;
  background: #f5f7fb;
}

.header {
  background: #fff;
  padding: 30rpx 24rpx;
}

.title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1f2430;
}

.tabs {
  display: flex;
  background: #fff;
  padding: 0 24rpx 20rpx;
  gap: 40rpx;
}

.tab {
  font-size: 28rpx;
  color: #8a94a6;
  padding-bottom: 16rpx;
}

.tab.active {
  color: #2f6dff;
  border-bottom: 4rpx solid #2f6dff;
  font-weight: 500;
}

.order-list {
  padding: 0 24rpx;
}

.order-item {
  background: #fff;
  padding: 24rpx;
  margin-top: 16rpx;
  border-radius: 12rpx;
}

.order-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #1f2430;
}

.order-status {
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 6rpx;
}

.order-status.pending {
  background: #e6f7ff;
  color: #1890ff;
}

.order-status.done {
  background: #f6ffed;
  color: #52c41a;
}

.order-status.review {
  background: #fff7e6;
  color: #fa8c16;
}

.order-desc {
  font-size: 26rpx;
  color: #8a94a6;
  margin-top: 12rpx;
}

.order-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16rpx;
}

.order-price {
  font-size: 32rpx;
  font-weight: 600;
  color: #ff4d4f;
}

.order-time {
  font-size: 24rpx;
  color: #999;
}
</style>
