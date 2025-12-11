<template>
  <view class="page">
    <view v-for="item in list" :key="item.id" class="card">
      <view class="row">
        <view class="title">{{ item.title }}</view>
        <view class="badge">{{ item.type }}</view>
      </view>
      <view class="meta">接单 {{ item.received }}/{{ item.total }}</view>
      <view class="status">状态：{{ item.status }}</view>
      <view class="actions">
        <view class="btn ghost" @click="endTask(item)">结束</view>
        <view class="btn primary" @click="view(item)">查看详情</view>
      </view>
    </view>
  </view>
</template>

<script>
import { realApi } from '../../config/api'

export default {
  data() {
    return { list: [] }
  },
  async onShow() {
    await this.loadData()
  },
  methods: {
    async endTask(item) {
      uni.showModal({
        title: '确认结束',
        content: `确定要结束任务「${item.title}」吗？`,
        success: async (res) => {
          if (res.confirm) {
            uni.showToast({ title: '任务已结束', icon: 'success' })
            this.loadData()
          }
        }
      })
    },
    async loadData() {
      try {
        const res = await realApi.getMyPublished()
        if (res.code === 0) {
          this.list = res.data
        }
      } catch (err) {
        console.error('加载失败', err)
      }
    },
    view(item) {
      uni.navigateTo({ url: `/pages/task/detail?id=${item.id}` })
    },
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

.status {
  margin-top: 6rpx;
  color: #fa8c43;
  font-size: 26rpx;
}

.actions {
  margin-top: 12rpx;
  display: flex;
  gap: 12rpx;
}

.btn {
  flex: 1;
  text-align: center;
  border-radius: 22rpx;
  padding: 14rpx 0;
  font-size: 28rpx;
}

.ghost {
  border: 2rpx solid #2f6dff;
  color: #2f6dff;
  background: #fff;
}

.primary {
  background: #2f6dff;
  color: #fff;
}
</style>
