<template>
  <view class="page">
    <view v-for="item in list" :key="item.id" class="card">
      <view class="row">
        <view class="title">{{ item.title }}</view>
        <view class="status">{{ item.status }}</view>
      </view>
      <view class="meta">截止：{{ item.deadline }}</view>
      <view class="actions">
        <view class="btn ghost" @click="view(item)">查看</view>
        <view class="btn primary" @click="finish(item)">提交完成</view>
      </view>
    </view>
  </view>
</template>

<script>
import { fetchMyReceived } from '../../mock/api'
import { realApi } from '../../config/api'

export default {
  data() {
    return { list: [] }
  },
  async onShow() {
    const res = await fetchMyReceived()
    this.list = res.data || []
  },
  methods: {
    view(item) {
      uni.navigateTo({ url: `/pages/task/detail?id=${item.id}` })
    },
    async finish(item) {
      if (item.status === '待审核' || item.status === '已通过') {
        uni.showToast({ title: '已提交，无需重复操作', icon: 'none' })
        return
      }
      try {
        const res = await realApi.submitOrder(item.orderId)
        if (res.code === 0) {
          uni.showToast({ title: res.message || '提交成功', icon: 'success' })
          // 刷新列表
          const listRes = await fetchMyReceived()
          this.list = listRes.data || []
        } else {
          uni.showToast({ title: res.message || '提交失败', icon: 'none' })
        }
      } catch (e) {
        console.error('提交失败', e)
        uni.showToast({ title: '提交失败，请重试', icon: 'none' })
      }
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

.status {
  color: #2f6dff;
  font-size: 24rpx;
}

.meta {
  margin-top: 8rpx;
  color: #4f5b71;
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
