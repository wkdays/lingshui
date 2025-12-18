<template>
	<view class="container">
		<view class="balance-card">
			<text class="balance-label">账户余额</text>
			<text class="balance-value">¥{{balance.toFixed(2)}}</text>
			<text class="balance-tip">余额可在四个小程序中共享使用</text>
		</view>
		
		<view class="section">
			<view class="section-header">
				<text class="section-title">充值金额</text>
			</view>
			<view class="amount-list">
				<view 
					class="amount-item" 
					:class="{active: selectedAmount === item}"
					v-for="item in amountList" 
					:key="item"
					@click="selectedAmount = item"
				>
					<text class="amount-value">¥{{item}}</text>
				</view>
			</view>
			<view class="custom-amount">
				<text>自定义金额</text>
				<input type="number" v-model="customAmount" placeholder="请输入金额" @input="selectedAmount = 0" />
			</view>
		</view>
		
		<button class="recharge-btn" @click="handleRecharge">立即充值</button>
		
		<view class="link-area">
			<text class="link" @click="goTransactions">查看交易明细 ></text>
		</view>
	</view>
</template>

<script>
import api from '@/api/index.js'
import storage from '@/utils/storage.js'

export default {
	data() {
		return {
			balance: 0,
			amountList: [50, 100, 200, 500],
			selectedAmount: 100,
			customAmount: ''
		}
	},
	onLoad() {
		if (!storage.getToken()) {
			uni.navigateTo({ url: '/pages/login/login' })
			return
		}
		this.loadBalance()
	},
	onShow() {
		if (!storage.getToken()) return
		// 每次显示时刷新余额
		this.balance = storage.getBalance()
	},
	methods: {
		async loadBalance() {
			const res = await api.getBalance()
			if (res.code === 0 && res.data) {
				this.balance = Number(res.data.balance || 0)
				return
			}
			this.balance = storage.getBalance()
		},
		async handleRecharge() {
			const amount = this.selectedAmount || Number(this.customAmount)
			if (!amount || amount <= 0) {
				uni.showToast({ title: '请选择或输入充值金额', icon: 'none' })
				return
			}
			uni.showLoading({ title: '充值中...' })
			const res = await api.recharge(amount)
			uni.hideLoading()
			
			if (res.code === 0) {
				this.balance = res.data.balance
				uni.showToast({ title: '充值成功', icon: 'success' })
			} else {
				uni.showToast({ title: res.message || '充值失败', icon: 'none' })
			}
		},
		goTransactions() {
			uni.navigateTo({ url: '/pages/balance/transactions' })
		}
	}
}
</script>

<style>
.container { 
	min-height: 100vh; 
	background: #f5f5f5; 
}
.balance-card { 
	background: #111; 
	padding: 60rpx 30rpx; 
	text-align: center;
	position: relative;
	overflow: hidden;
}
.balance-card::before {
	content: '';
	position: absolute;
	top: -50%;
	right: -20%;
	width: 300rpx;
	height: 300rpx;
	background: rgba(255,255,255,0.1);
	border-radius: 50%;
}
.balance-card::after {
	content: '';
	position: absolute;
	bottom: -30%;
	left: -10%;
	width: 200rpx;
	height: 200rpx;
	background: rgba(255,255,255,0.08);
	border-radius: 50%;
}
.balance-label { 
	font-size: 28rpx; 
	color: rgba(255,255,255,0.9); 
	display: block;
	position: relative;
	z-index: 1;
}
.balance-value { 
	font-size: 80rpx; 
	color: #fff; 
	font-weight: bold; 
	margin: 24rpx 0; 
	display: block;
	position: relative;
	z-index: 1;
	text-shadow: 0 4rpx 8rpx rgba(0,0,0,0.1);
}
.balance-tip { 
	font-size: 24rpx; 
	color: rgba(255,255,255,0.8); 
	display: block;
	position: relative;
	z-index: 1;
}
.section { 
	background: #fff; 
	margin: 20rpx; 
	border-radius: 16rpx; 
	padding: 24rpx;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}
.section-header { 
	margin-bottom: 24rpx; 
}
.section-title { 
	font-size: 30rpx; 
	font-weight: bold; 
	color: #333; 
}
.amount-list { 
	display: flex; 
	flex-wrap: wrap; 
	gap: 20rpx; 
}
.amount-item { 
	width: calc(50% - 10rpx); 
	height: 110rpx; 
	display: flex; 
	align-items: center; 
	justify-content: center; 
	background: #f8f8f8; 
	border-radius: 12rpx; 
	border: 2rpx solid transparent;
	transition: all 0.2s ease;
}
.amount-item.active { 
	background: #f5f5f5; 
	border-color: #111;
	transform: scale(1.02);
}
.amount-value { 
	font-size: 34rpx; 
	color: #333; 
	font-weight: bold; 
}
.amount-item.active .amount-value { 
	color: #111; 
}
.custom-amount { 
	display: flex; 
	align-items: center; 
	margin-top: 24rpx; 
	padding-top: 24rpx; 
	border-top: 1rpx solid #f0f0f0; 
}
.custom-amount text { 
	font-size: 28rpx; 
	color: #666; 
	margin-right: 20rpx;
	white-space: nowrap;
}
.custom-amount input { 
	flex: 1; 
	height: 80rpx; 
	background: #f8f8f8; 
	border-radius: 12rpx; 
	padding: 0 24rpx; 
	font-size: 30rpx; 
}
.recharge-btn { 
	margin: 40rpx 20rpx; 
	background: #111; 
	color: #fff; 
	border-radius: 44rpx; 
	height: 96rpx; 
	line-height: 96rpx; 
	font-size: 32rpx;
	font-weight: 500;
	box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.18);
}
.link-area { 
	text-align: center;
	padding-bottom: 40rpx;
}
.link { 
	font-size: 28rpx; 
	color: #111; 
}
</style>
