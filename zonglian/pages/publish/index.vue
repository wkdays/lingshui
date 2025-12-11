<template>
  <view class="page">
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <text class="title">发布任务</text>
    </view>

    <view class="section">
      <view class="section-title">简单任务</view>
      <view class="grid">
        <view
        v-for="item in simpleTaskTypes"
        :key="item.id"
        class="grid-item"
        @click="goCreate(item, 'daily')"
      >
          <view class="circle" :style="{ backgroundColor: item.color }">
            <image class="circle-img" :src="item.iconUrl" mode="aspectFit" />
          </view>
          <view class="grid-text">{{ item.label }}</view>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-title">特色任务</view>
      <view class="grid">
        <view
        v-for="item in specialTaskTypes"
        :key="item.id"
        class="grid-item"
        @click="goCreate(item, 'bounty')"
      >
          <view class="circle" :style="{ backgroundColor: item.color }">
            <image class="circle-img" :src="item.iconUrl || '/static/ic-verified.png'" mode="aspectFit" />
          </view>
          <view class="grid-text">{{ item.label }}</view>
        </view>
      </view>
    </view>

    <view class="tip">
      发布入口已预留，点击任意分类将跳转到发布表单，并使用 mock 接口提交。
    </view>
  </view>
</template>

<script>
import { fetchHome } from '../../mock/api'

export default {
  data() {
    return {
      statusBarHeight: 20,
      simpleTaskTypes: [],
      specialTaskTypes: [],
    }
  },
  async onLoad() {
    const info = uni.getSystemInfoSync()
    this.statusBarHeight = info.statusBarHeight || 20
    const res = await fetchHome()
    this.simpleTaskTypes = res.data.simpleTaskTypes
    this.specialTaskTypes = res.data.specialTaskTypes
  },
  methods: {
    goCreate(item, taskType) {
      const query = `?type=${taskType}&category=${item.id}&label=${item.label}`
      uni.navigateTo({ url: `/pages/task/create${query}` })
    },
  },
}
</script>

<style>
.page {
  background: #f5f7fb;
  min-height: 100vh;
  padding: 0 24rpx 40rpx;
  box-sizing: border-box;
}

.header {
  background: #2f6dff;
  color: #fff;
  padding: 20rpx 10rpx 26rpx;
  border-bottom-left-radius: 26rpx;
  border-bottom-right-radius: 26rpx;
  text-align: center;
}

.title {
  font-size: 32rpx;
  font-weight: 600;
}

.section {
  background: #fff;
  margin-top: 24rpx;
  border-radius: 20rpx;
  padding: 18rpx;
  box-shadow: 0 10rpx 24rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 30rpx;
  color: #1f2430;
  font-weight: 600;
  margin-bottom: 12rpx;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18rpx 12rpx;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.circle {
  width: 90rpx;
  height: 90rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-img {
  width: 48rpx;
  height: 48rpx;
}

.grid-text {
  margin-top: 10rpx;
  font-size: 26rpx;
  color: #4f5b71;
}

.tip {
  margin-top: 18rpx;
  font-size: 24rpx;
  color: #7a8299;
  line-height: 1.5;
}
</style>
