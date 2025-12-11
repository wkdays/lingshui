<template>
  <view class="page">
    <view v-for="item in list" :key="item.id" class="card">
      <view class="row">
        <view class="title">{{ item.title }}</view>
        <view class="badge">{{ item.type || '记录' }}</view>
      </view>
      <view class="meta">{{ item.status || '已完成' }}</view>
    </view>
  </view>
</template>

<script>
import { fetchHistory } from '../../mock/api'

export default {
  data() {
    return { list: [] }
  },
  async onShow() {
    const res = await fetchHistory()
    this.list = res.data
  },
}
</script>

<style>
.page {
  padding: 16rpx 24rpx 40rpx;
  background: #f5f7fb;
  min-height: 100vh;
}

.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 16rpx;
  margin-bottom: 12rpx;
  box-shadow: 0 8rpx 18rpx rgba(0, 0, 0, 0.05);
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 30rpx;
  font-weight: 700;
}

.badge {
  background: rgba(47, 109, 255, 0.12);
  color: #2f6dff;
  padding: 6rpx 14rpx;
  border-radius: 14rpx;
  font-size: 22rpx;
}

.meta {
  margin-top: 8rpx;
  color: #4f5b71;
  font-size: 26rpx;
}
</style>
