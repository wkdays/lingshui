<template>
	<view class="container">
		<!-- 筛选tabs -->
		<view class="tabs">
			<view class="tab-item" :class="{active: currentTab === 'all'}" @click="switchTab('all')">全部</view>
			<view class="tab-item" :class="{active: currentTab === 'consume'}" @click="switchTab('consume')">消费</view>
			<view class="tab-item" :class="{active: currentTab === 'recharge'}" @click="switchTab('recharge')">充值</view>
		</view>
		
		<!-- 交易列表 -->
		<scroll-view class="transaction-list" scroll-y>
			<view class="empty" v-if="filteredList.length === 0">
				<text class="empty-text">暂无交易记录</text>
			</view>
			<view class="transaction-item" v-for="item in filteredList" :key="item.id">
				<view class="item-icon" :class="item.type">
					<text v-if="item.type === 'consume'">💳</text>
					<text v-else>💰</text>
				</view>
				<view class="item-info">
					<text class="item-title">{{item.title}}</text>
					<text class="item-time">{{item.time}}</text>
					<text class="item-order" v-if="item.orderId">订单号：{{item.orderId}}</text>
				</view>
				<view class="item-amount" :class="item.type">
					<text>{{item.amount > 0 ? '+' : ''}}{{item.amount.toFixed(2)}}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { transactionApi } from '@/api/mock.js'

export default {
	data() {
		return {
			currentTab: 'all',
			transactionList: []
		}
	},
	computed: {
		filteredList() {
			if (this.currentTab === 'all') {
				return this.transactionList
			}
			return this.transactionList.filter(item => item.type === this.currentTab)
		}
	},
	onLoad() {
		this.loadTransactions()
	},
	methods: {
		async loadTransactions() {
			const res = await transactionApi.getTransactions()
			if (res.code === 0) {
				this.transactionList = res.data
			}
		},
		switchTab(tab) {
			this.currentTab = tab
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: #f5f5f5;
}

.tabs {
	display: flex;
	background: #fff;
	padding: 0;
	position: sticky;
	top: 0;
	z-index: 10;
}

.tab-item {
	flex: 1;
	text-align: center;
	padding: 28rpx 0;
	font-size: 28rpx;
	color: #666;
	position: relative;
}

.tab-item.active {
	color: #4CD964;
	font-weight: bold;
}

.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 60rpx;
	height: 6rpx;
	background: #4CD964;
	border-radius: 3rpx;
}

.transaction-list {
	padding: 20rpx;
	height: calc(100vh - 84rpx);
}

.empty {
	text-align: center;
	padding: 100rpx 0;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}

.transaction-item {
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 16rpx;
}

.item-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	margin-right: 20rpx;
}

.item-icon.consume {
	background: rgba(255, 107, 0, 0.1);
}

.item-icon.recharge {
	background: rgba(76, 217, 100, 0.1);
}

.item-info {
	flex: 1;
}

.item-title {
	font-size: 30rpx;
	color: #333;
	display: block;
	font-weight: 500;
}

.item-time {
	font-size: 24rpx;
	color: #999;
	display: block;
	margin-top: 8rpx;
}

.item-order {
	font-size: 22rpx;
	color: #bbb;
	display: block;
	margin-top: 6rpx;
}

.item-amount {
	font-size: 36rpx;
	font-weight: bold;
}

.item-amount.consume {
	color: #ff6b00;
}

.item-amount.recharge {
	color: #4CD964;
}
</style>
