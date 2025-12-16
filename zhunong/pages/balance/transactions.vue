<template>
	<view class="container">
		<view class="transaction-list">
			<view class="transaction-item" v-for="item in transactions" :key="item.id">
				<view class="trans-left">
					<text class="trans-icon">{{item.type === 'recharge' ? '💰' : '🛒'}}</text>
					<view class="trans-info">
						<text class="trans-title">{{item.title}}</text>
						<text class="trans-time">{{item.time}}</text>
						<text class="trans-order" v-if="item.orderNo">订单号：{{item.orderNo}}</text>
					</view>
				</view>
				<text class="trans-amount" :class="{income: item.amount > 0}">
					{{item.amount > 0 ? '+' : ''}}{{item.amount.toFixed(2)}}
				</text>
			</view>
		</view>
		
		<view class="empty" v-if="!transactions.length">
			<text class="empty-icon">📝</text>
			<text class="empty-text">暂无交易记录</text>
		</view>
	</view>
</template>

<script>
import api from '@/api/index.js'

export default {
	data() {
		return {
			transactions: []
		}
	},
	onLoad() {
		this.loadTransactions()
	},
	onShow() {
		// 每次显示时刷新
		this.loadTransactions()
	},
	methods: {
		async loadTransactions() {
			const res = await api.getTransactions()
			this.transactions = res.data || []
		}
	}
}
</script>

<style>
.container { min-height: 100vh; background: #f5f5f5; }
.transaction-list { padding: 20rpx; }
.transaction-item { display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 24rpx; border-radius: 12rpx; margin-bottom: 20rpx; }
.trans-left { display: flex; align-items: center; }
.trans-icon { font-size: 48rpx; margin-right: 20rpx; }
.trans-info { display: flex; flex-direction: column; }
.trans-title { font-size: 28rpx; color: #333; }
.trans-time { font-size: 24rpx; color: #999; margin-top: 8rpx; }
.trans-order { font-size: 22rpx; color: #999; margin-top: 4rpx; }
.trans-amount { font-size: 32rpx; color: #FF4444; font-weight: bold; }
.trans-amount.income { color: #4CAF50; }
.empty { display: flex; flex-direction: column; align-items: center; padding-top: 200rpx; }
.empty-icon { font-size: 120rpx; }
.empty-text { font-size: 28rpx; color: #999; margin-top: 20rpx; }
</style>
