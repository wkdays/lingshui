<template>
  <view class="page">
    <view class="filter">
      <view
        v-for="item in tabs"
        :key="item.id"
        class="pill"
        :class="{ active: currentType === item.id }"
        @click="switchType(item.id)"
      >
        {{ item.label }}
      </view>
    </view>
    <view v-for="task in list" :key="task.id" class="card" @click="goDetail(task.id)">
      <view class="row">
        <view class="title">{{ task.title }}</view>
        <view class="badge">{{ task.tag }}</view>
      </view>
      <view class="desc">{{ task.desc }}</view>
      <view class="meta">
        <text>{{ task.location }}</text>
        <text>{{ task.period }}</text>
        <text>人数 {{ task.peopleNeeded }}</text>
      </view>
      <view class="row footer">
        <view class="publisher">{{ task.publisher }}</view>
        <view class="price">￥{{ task.price }} {{ task.unit }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { fetchTasks } from '../../mock/api'

export default {
  data() {
    return {
      tabs: [
        { id: '', label: '全部' },
        { id: 'daily', label: '日结单' },
        { id: 'bounty', label: '赏金单' },
      ],
      currentType: '',
      list: [],
    }
  },
  async onLoad(query) {
    this.currentType = query.type || ''
    await this.load()
  },
  methods: {
    async load() {
      const res = await fetchTasks({ type: this.currentType || undefined })
      this.list = res.data.list
    },
    switchType(id) {
      this.currentType = id
      this.load()
    },
    goDetail(id) {
      uni.navigateTo({ url: `/pages/task/detail?id=${id}` })
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

.filter {
  display: flex;
  margin-bottom: 16rpx;
}

.pill {
  padding: 12rpx 20rpx;
  background: #eef2fb;
  color: #4f5b71;
  border-radius: 20rpx;
  margin-right: 12rpx;
  font-size: 26rpx;
}

.pill.active {
  background: #2f6dff;
  color: #fff;
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
  color: #1f2430;
}

.badge {
  background: rgba(47, 109, 255, 0.12);
  color: #2f6dff;
  padding: 6rpx 14rpx;
  border-radius: 14rpx;
  font-size: 22rpx;
}

.desc {
  margin-top: 10rpx;
  color: #7a8299;
  font-size: 26rpx;
}

.meta {
  margin-top: 10rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  color: #4f5b71;
  font-size: 24rpx;
}

.publisher {
  color: #4f5b71;
  font-size: 26rpx;
}

.price {
  color: #fa8c43;
  font-size: 30rpx;
  font-weight: 700;
}

.footer {
  margin-top: 12rpx;
}
</style>
