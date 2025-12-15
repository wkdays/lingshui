<template>
	<view class="container">
		<!-- 余额卡片 -->
		<view class="balance-card">
			<text class="label">账户余额(元)</text>
			<view class="amount-row">
				<text class="symbol">¥</text>
				<text class="amount">{{balance.toFixed(2)}}</text>
			</view>
			<text class="tip">余额可在四个小程序中共享使用</text>
		</view>
		
		<!-- 充值金额选择 -->
		<view class="section">
			<view class="section-title">选择充值金额</view>
			<view class="amount-grid">
				<view 
					class="amount-item" 
					:class="{active: selectedAmount === item}" 
					v-for="item in amountList" 
					:key="item"
					@click="selectAmount(item)">
					<text class="item-amount">{{item}}元</text>
				</view>
			</view>
			<view class="custom-input">
				<text class="input-label">其他金额：</text>
				<input 
					class="input" 
					type="number" 
					v-model="customAmount" 
					placeholder="请输入充值金额" 
					@input="onCustomInput" />
			</view>
		</view>
		
		<!-- 充值按钮 -->
		<view class="recharge-btn" @click="recharge">立即充值 ¥{{rechargeAmount}}</view>
		
		<!-- 充值记录入口 -->
		<view class="record-link" @click="goTransactions">
			查看交易明细 ›
		</view>
	</view>
</template>

<script>
import { userApi, transactionApi } from '@/api/mock.js'

export default {
	data() {
		return {
			balance: 0,
			amountList: [50, 100, 200, 500, 1000, 2000],
			selectedAmount: 100,
			customAmount: ''
		}
	},
	computed: {
		rechargeAmount() {
			if (this.customAmount) {
				return parseFloat(this.customAmount) || 0
			}
			return this.selectedAmount
		}
	},
	onLoad() {
		this.loadBalance()
	},
	onShow() {
		this.loadBalance()
	},
	methods: {
		async loadBalance() {
			const res = await userApi.getBalance()
			if (res.code === 0) {
				this.balance = res.data.balance
			}
		},
		selectAmount(amount) {
			this.selectedAmount = amount
			this.customAmount = ''
		},
		onCustomInput() {
			if (this.customAmount) {
				this.selectedAmount = 0
			}
		},
		recharge() {
			if (this.rechargeAmount <= 0) {
				uni.showToast({ title: '请选择或输入充值金额', icon: 'none' })
				return
			}
			uni.showModal({
				title: '确认充值',
				content: `确认充值¥${this.rechargeAmount}？`,
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '充值中...' })
						const result = await transactionApi.addRecharge(this.rechargeAmount)
						uni.hideLoading()
						if (result.code === 0) {
							this.balance = result.data.balance
							this.customAmount = ''
							uni.showToast({ title: '充值成功', icon: 'success' })
						} else {
							uni.showToast({ title: result.msg || '充值失败', icon: 'none' })
						}
					}
				}
			})
		},
		goTransactions() {
			uni.navigateTo({ url: '/pages/mine/transactions' })
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: #f5f5f5;
	padding: 20rpx;
}

.balance-card {
	background: linear-gradient(135deg, #4CD964 0%, #5AC8FA 100%);
	border-radius: 20rpx;
	padding: 50rpx 40rpx;
	text-align: center;
	margin-bottom: 30rpx;
}

.label {
	font-size: 28rpx;
	color: rgba(255,255,255,0.8);
	display: block;
	margin-bottom: 20rpx;
}

.amount-row {
	display: flex;
	justify-content: center;
	align-items: baseline;
	margin-bottom: 20rpx;
}

.symbol {
	font-size: 36rpx;
	color: #fff;
	font-weight: bold;
}

.amount {
	font-size: 72rpx;
	color: #fff;
	font-weight: bold;
}

.tip {
	font-size: 24rpx;
	color: rgba(255,255,255,0.7);
}

.section {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
}

.section-title {
	font-size: 30rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 24rpx;
}

.amount-grid {
	display: flex;
	flex-wrap: wrap;
	margin: 0 -10rpx;
}

.amount-item {
	width: calc(33.33% - 20rpx);
	margin: 10rpx;
	padding: 30rpx 0;
	text-align: center;
	background: #f5f5f5;
	border-radius: 12rpx;
	border: 2rpx solid transparent;
}

.amount-item.active {
	background: rgba(76, 217, 100, 0.1);
	border-color: #4CD964;
}

.item-amount {
	font-size: 32rpx;
	color: #333;
	font-weight: 500;
}

.amount-item.active .item-amount {
	color: #4CD964;
}

.custom-input {
	display: flex;
	align-items: center;
	margin-top: 24rpx;
	padding-top: 24rpx;
	border-top: 1rpx solid #f0f0f0;
}

.input-label {
	font-size: 28rpx;
	color: #666;
	white-space: nowrap;
}

.input {
	flex: 1;
	height: 80rpx;
	font-size: 28rpx;
	padding: 0 20rpx;
	background: #f5f5f5;
	border-radius: 12rpx;
}

.recharge-btn {
	margin: 40rpx 0;
	padding: 30rpx;
	background: linear-gradient(135deg, #4CD964 0%, #5AC8FA 100%);
	color: #fff;
	font-size: 32rpx;
	font-weight: bold;
	text-align: center;
	border-radius: 50rpx;
}

.record-link {
	text-align: center;
	font-size: 28rpx;
	color: #4CD964;
}
</style>
