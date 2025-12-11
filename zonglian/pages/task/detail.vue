<template>
  <view class="page" v-if="task">
    <view class="card">
      <view class="title-row">
        <view class="task-title">{{ task.title }}</view>
        <view class="tag primary">{{ task.tag }}</view>
      </view>
      <view class="price">
        <text class="price-num">￥{{ task.price }}</text>
        <text class="price-unit">{{ task.unit }}</text>
      </view>
      <view class="desc">{{ task.desc }}</view>
      <view class="meta">
        <text>地点：{{ task.location }}</text>
        <text>人数上限：{{ task.peopleNeeded }}</text>
        <text>执行时间：{{ task.period }}</text>
        <text>结算时间：{{ task.date }}</text>
      </view>
    </view>

    <view class="card">
      <view class="section-title">任务状态</view>
      <view class="status">{{ task.status }}</view>
      <view class="section-title">发布人</view>
      <view class="meta">
        <text>{{ task.publisher }}</text>
      </view>
    </view>

    <view class="bottom-bar">
      <view class="action secondary" @click="goMessages">消息中心</view>
      <view class="action primary" @click="accept">接单</view>
    </view>
  </view>
</template>

<script>
import { fetchTaskDetail, acceptTask } from '../../mock/api'

export default {
  data() {
    return {
      task: null,
    }
  },
  async onLoad(query) {
    console.log('详情页参数:', query)
    const res = await fetchTaskDetail(query.id)
    console.log('任务详情返回:', res)
    this.task = res.data
  },
  methods: {
    async accept() {
      console.log('点击接单, task:', this.task)
      if (!this.task) {
        uni.showToast({ title: '任务数据未加载', icon: 'none' })
        return
      }
      // 检查是否登录
      const token = uni.getStorageSync('token')
      if (!token) {
        uni.showToast({ title: '请先登录', icon: 'none' })
        setTimeout(() => {
          uni.navigateTo({ url: '/pages/auth/login' })
        }, 1000)
        return
      }
      // 校验资格和人数上限
      if (this.task.status === '已结束' || this.task.status === '已满员' || this.task.status === 'closed') {
        uni.showToast({ title: '该任务无法接单', icon: 'none' })
        return
      }
      try {
        const res = await acceptTask(this.task.id)
        if (res && (res.code === 0 || res.success)) {
          uni.showToast({ title: res.message || '接单成功', icon: 'success' })
          setTimeout(() => {
            uni.navigateTo({ url: '/pages/task/my-received' })
          }, 1000)
        } else {
          uni.showToast({ title: (res && res.message) || '接单失败', icon: 'none' })
        }
      } catch (e) {
        console.error('接单异常', e)
        uni.showToast({ title: '接单失败，请重试', icon: 'none' })
      }
    },
    goMessages() {
      uni.navigateTo({ url: '/pages/messages/index' })
    },
  },
}
</script>

<style>
.page {
  padding: 20rpx 24rpx 120rpx;
  background: #f5f7fb;
  min-height: 100vh;
  box-sizing: border-box;
}

.card {
  background: #fff;
  border-radius: 18rpx;
  padding: 18rpx;
  box-shadow: 0 10rpx 24rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 16rpx;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1f2430;
}

.tag {
  padding: 6rpx 14rpx;
  border-radius: 14rpx;
  font-size: 22rpx;
}

.primary {
  background: rgba(47, 109, 255, 0.12);
  color: #2f6dff;
}

.price {
  margin-top: 12rpx;
  display: flex;
  align-items: baseline;
  color: #fa8c43;
}

.price-num {
  font-size: 40rpx;
  font-weight: 800;
}

.price-unit {
  margin-left: 8rpx;
  font-size: 24rpx;
}

.desc {
  margin-top: 10rpx;
  color: #7a8299;
  font-size: 26rpx;
  line-height: 1.6;
}

.meta {
  margin-top: 12rpx;
  display: grid;
  gap: 8rpx;
  color: #4f5b71;
  font-size: 26rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  margin-bottom: 10rpx;
  color: #1f2430;
}

.status {
  font-size: 28rpx;
  color: #2f6dff;
  margin-bottom: 12rpx;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12rpx 24rpx 24rpx;
  display: flex;
  background: #f5f7fb;
  gap: 14rpx;
  box-sizing: border-box;
}

.action {
  flex: 1;
  text-align: center;
  border-radius: 24rpx;
  padding: 18rpx 0;
  font-size: 30rpx;
}

.secondary {
  background: #fff;
  color: #2f6dff;
  border: 2rpx solid #2f6dff;
}

.action.primary {
  background: linear-gradient(120deg, #2f6dff, #6ca7ff);
  color: #fff;
  font-weight: 700;
}
</style>
