<template>
  <view class="page">
    <view class="card">
      <view class="section-title">充值金额</view>
      <input v-model="amount" type="number" placeholder="请输入充值金额" />
      <view class="tip">调起微信支付接口已预留，当前使用 mock 直接入账。</view>
      <view class="btn" @click="submit">立即充值</view>
    </view>
  </view>
</template>

<script>
import { recharge } from '../../mock/api'

export default {
  data() {
    return { amount: '' }
  },
  methods: {
    async submit() {
      const res = await recharge(this.amount)
      uni.showToast({ title: `余额：${res.data.balance} 元`, icon: 'none' })
      uni.navigateBack()
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
  border-radius: 18rpx;
  padding: 18rpx;
  box-shadow: 0 10rpx 24rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  margin-bottom: 12rpx;
  color: #1f2430;
}

input {
  width: 100%;
  background: #f5f7fb;
  border-radius: 14rpx;
  padding: 16rpx;
  box-sizing: border-box;
  font-size: 28rpx;
}

.tip {
  margin-top: 10rpx;
  color: #7a8299;
  font-size: 24rpx;
}

.btn {
  margin-top: 20rpx;
  background: linear-gradient(120deg, #2f6dff, #6ca7ff);
  color: #fff;
  text-align: center;
  padding: 16rpx 0;
  border-radius: 24rpx;
  font-size: 30rpx;
  font-weight: 700;
}
</style>
