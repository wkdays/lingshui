<template>
	<view class="container">
		<view class="result-area">
			<text class="result-icon">✅</text>
			<text class="result-title">支付成功</text>
			<text class="result-desc">订单已提交，商家正在备货中</text>
		</view>
		
		<view class="order-info">
			<view class="info-item">
				<text class="info-label">订单编号</text>
				<text class="info-value">{{orderId}}</text>
			</view>
			<view class="info-item">
				<text class="info-label">支付金额</text>
				<text class="info-value price">¥{{totalPrice}}</text>
			</view>
		</view>
		
		<view class="actions">
			<button class="btn-outline" @click="goOrderDetail">查看订单</button>
			<button class="btn-primary" @click="goHome">返回首页</button>
		</view>
	</view>
</template>

<script>
import api from '@/api/index.js'

export default {
	data() {
		return {
			orderId: '',
			totalPrice: '0.00'
		}
	},
	async onLoad(options) {
		this.orderId = options.orderId || ''
		if (this.orderId) {
			const res = await api.getOrderDetail(this.orderId)
			if (res.code === 0 && res.data) {
				this.totalPrice = Number(res.data.totalPrice || 0).toFixed(2)
				return
			}
		}
		const orderGoods = uni.getStorageSync('orderGoods') || []
		this.totalPrice = orderGoods.reduce((sum, item) => sum + item.price * item.count, 0).toFixed(2)
	},
	methods: {
		goOrderDetail() {
			uni.redirectTo({ url: '/pages/order/detail?id=' + this.orderId })
		},
		goHome() {
			uni.switchTab({ url: '/pages/index/index' })
		}
	}
}
</script>

<style>
.container { min-height: 100vh; background: #f5f5f5; padding: 40rpx; }
.result-area { display: flex; flex-direction: column; align-items: center; padding: 60rpx 0; background: #fff; border-radius: 16rpx; }
.result-icon { font-size: 120rpx; }
.result-title { font-size: 36rpx; font-weight: bold; color: #333; margin-top: 20rpx; }
.result-desc { font-size: 28rpx; color: #999; margin-top: 16rpx; }
.order-info { background: #fff; border-radius: 16rpx; padding: 24rpx; margin-top: 20rpx; }
.info-item { display: flex; justify-content: space-between; padding: 16rpx 0; }
.info-label { font-size: 28rpx; color: #666; }
.info-value { font-size: 28rpx; color: #333; }
.info-value.price { color: #FF4444; font-weight: bold; }
.actions { display: flex; margin-top: 60rpx; }
.btn-outline { flex: 1; height: 88rpx; line-height: 88rpx; background: #fff; border: 2rpx solid #111; color: #111; border-radius: 44rpx; margin-right: 20rpx; font-size: 30rpx; }
.btn-primary { flex: 1; height: 88rpx; line-height: 88rpx; background: #111; color: #fff; border-radius: 44rpx; font-size: 30rpx; }
</style>
