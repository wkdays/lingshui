<template>
	<view class="container">
		<!-- 收货方式选择 -->
		<view class="section">
			<view class="section-title">收货方式</view>
			<view class="delivery-options">
				<view 
					class="delivery-item" 
					:class="{active: deliveryType === 0}" 
					@click="setDeliveryType(0)">
					<text class="delivery-icon">🏪</text>
					<text class="delivery-name">到店取货</text>
				</view>
				<view 
					class="delivery-item" 
					:class="{active: deliveryType === 1}" 
					@click="setDeliveryType(1)">
					<text class="delivery-icon">📦</text>
					<text class="delivery-name">送到驿站</text>
				</view>
				<view 
					class="delivery-item" 
					:class="{active: deliveryType === 2}" 
					@click="setDeliveryType(2)">
					<text class="delivery-icon">🚚</text>
					<text class="delivery-name">送货上门</text>
				</view>
			</view>
		</view>
		
		<!-- 收货信息 -->
		<view class="section">
			<view class="section-title">{{deliveryLabel}}</view>
			<view class="address-input" v-if="deliveryType === 0">
				<picker :range="pickupPoints" @change="onPickupChange">
					<view class="picker-content">
						<text>{{selectedPickup || '请选择自提点'}}</text>
						<text class="arrow">→</text>
					</view>
				</picker>
			</view>
			<view class="address-input" v-else-if="deliveryType === 1">
				<picker :range="stations" @change="onStationChange">
					<view class="picker-content">
						<text>{{selectedStation || '请选择驿站'}}</text>
						<text class="arrow">→</text>
					</view>
				</picker>
			</view>
			<view class="address-input" v-else>
				<input class="input" v-model="address" placeholder="请输入收货地址" />
				<input class="input" v-model="phone" placeholder="请输入联系电话" type="number" />
			</view>
		</view>
		
		<!-- 商品列表 -->
		<view class="section">
			<view class="section-title">商品信息</view>
			<view class="product-list">
				<view class="product-item" v-for="item in orderItems" :key="item.id || item.date + item.type">
					<image class="product-image" :src="item.image || '/static/images/food1.png'" mode="aspectFill"></image>
					<view class="product-info">
						<text class="product-name">{{item.name || (item.date + ' ' + item.type)}}</text>
						<text class="product-spec" v-if="item.spec">{{item.spec}}</text>
						<view class="product-price-row">
							<text class="product-price">¥{{item.price}}</text>
							<text class="product-qty">x{{item.quantity || 1}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 支付方式 -->
		<view class="section">
			<view class="section-title">支付方式</view>
			<view class="pay-options">
				<view 
					class="pay-item" 
					:class="{active: payType === 0}" 
					@click="setPayType(0)">
					<text class="pay-icon">💳</text>
					<view class="pay-info">
						<text class="pay-name">余额支付</text>
						<text class="pay-balance">可用余额：¥{{balance.toFixed(2)}}</text>
					</view>
					<view class="pay-check" v-if="payType === 0">✓</view>
				</view>
				<view 
					class="pay-item" 
					:class="{active: payType === 1}" 
					@click="setPayType(1)">
					<text class="pay-icon">💚</text>
					<view class="pay-info">
						<text class="pay-name">微信支付</text>
					</view>
					<view class="pay-check" v-if="payType === 1">✓</view>
				</view>
			</view>
		</view>
		
		<!-- 订单金额 -->
		<view class="section amount-section">
			<view class="amount-row">
				<text class="amount-label">商品金额</text>
				<text class="amount-value">¥{{totalAmount.toFixed(2)}}</text>
			</view>
			<view class="amount-row">
				<text class="amount-label">配送费</text>
				<text class="amount-value">¥{{deliveryFee.toFixed(2)}}</text>
			</view>
			<view class="amount-row total">
				<text class="amount-label">实付金额</text>
				<text class="amount-value pay-amount">¥{{payAmount.toFixed(2)}}</text>
			</view>
		</view>
		
		<!-- 底部提交 -->
		<view class="bottom-bar">
			<view class="total-info">
				<text class="total-label">实付：</text>
				<text class="total-price">¥{{payAmount.toFixed(2)}}</text>
			</view>
			<view class="submit-btn" @click="submitOrder">提交订单</view>
		</view>
	</view>
</template>

<script>
import { orderApi, userApi, cartApi } from '@/api/mock.js'

export default {
	data() {
		return {
			orderItems: [],
			deliveryType: 0,
			payType: 0,
			balance: 0,
			address: '',
			phone: '',
			pickupPoints: ['1号楼自提点', '2号楼自提点', '3号楼自提点'],
			stations: ['1号楼驿站', '2号楼驿站', '3号楼驿站'],
			selectedPickup: '',
			selectedStation: '',
			deliveryFee: 0,
			from: ''
		}
	},
	computed: {
		deliveryLabel() {
			const labels = ['自提点', '驿站地址', '收货地址']
			return labels[this.deliveryType]
		},
		totalAmount() {
			return this.orderItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
		},
		payAmount() {
			return this.totalAmount + this.deliveryFee
		}
	},
	onLoad(options) {
		this.from = options.from || ''
		this.loadOrderItems()
		this.loadBalance()
	},
	methods: {
		loadOrderItems() {
			if (this.from === 'cart') {
				this.orderItems = uni.getStorageSync('checkoutItems') || []
			} else {
				const selectedMeals = uni.getStorageSync('selectedMeals') || []
				this.orderItems = selectedMeals.map(meal => ({
					...meal,
					name: meal.date + ' ' + meal.type,
					quantity: 1
				}))
			}
		},
		async loadBalance() {
			const res = await userApi.getBalance()
			if (res.code === 0) {
				this.balance = res.data.balance
			}
		},
		setDeliveryType(type) {
			this.deliveryType = type
			this.deliveryFee = type === 2 ? 5 : 0
		},
		setPayType(type) {
			this.payType = type
		},
		onPickupChange(e) {
			this.selectedPickup = this.pickupPoints[e.detail.value]
		},
		onStationChange(e) {
			this.selectedStation = this.stations[e.detail.value]
		},
		async submitOrder() {
			// 验证
			if (this.deliveryType === 0 && !this.selectedPickup) {
				uni.showToast({ title: '请选择自提点', icon: 'none' })
				return
			}
			if (this.deliveryType === 1 && !this.selectedStation) {
				uni.showToast({ title: '请选择驿站', icon: 'none' })
				return
			}
			if (this.deliveryType === 2 && (!this.address || !this.phone)) {
				uni.showToast({ title: '请填写收货地址和电话', icon: 'none' })
				return
			}
			
			// 余额支付检查
			if (this.payType === 0 && this.balance < this.payAmount) {
				uni.showModal({
					title: '余额不足',
					content: '当前余额不足，是否切换到微信支付？',
					confirmText: '微信支付',
					success: (res) => {
						if (res.confirm) {
							this.payType = 1
						}
					}
				})
				return
			}
			
			let deliveryAddress = ''
			if (this.deliveryType === 0) deliveryAddress = this.selectedPickup
			else if (this.deliveryType === 1) deliveryAddress = this.selectedStation
			else deliveryAddress = this.address + ' ' + this.phone
			
			const orderData = {
				products: this.orderItems,
				totalAmount: this.totalAmount,
				payAmount: this.payAmount,
				deliveryType: this.deliveryType,
				deliveryAddress: deliveryAddress,
				payType: this.payType
			}
			
			uni.showLoading({ title: '提交中...' })
			const res = await orderApi.createOrder(orderData)
			uni.hideLoading()
			
			if (res.code === 0) {
				const orderId = res.data.id
				
				// 余额支付
				if (this.payType === 0) {
					uni.showLoading({ title: '支付中...' })
					const payRes = await orderApi.payOrder(orderId, 0)
					uni.hideLoading()
					
					if (payRes.code === 0) {
						// 触发打印（推送至外卖打印机）
						await orderApi.printOrder(orderId)
						
						// 清空购物车
						if (this.from === 'cart') {
							await cartApi.clearCart()
						}
						uni.removeStorageSync('checkoutItems')
						uni.removeStorageSync('selectedMeals')
						
						uni.showModal({
							title: '支付成功',
							content: `订单号：${orderId}\n已从余额扣除¥${this.payAmount.toFixed(2)}\n订单已推送至打印机`,
							showCancel: false,
							success: () => {
								uni.redirectTo({ url: '/pages/order/detail?id=' + orderId })
							}
						})
					} else {
						uni.showToast({ title: payRes.msg || '支付失败', icon: 'none' })
					}
				} else {
					// 微信支付（模拟）
					if (this.from === 'cart') {
						await cartApi.clearCart()
					}
					uni.removeStorageSync('checkoutItems')
					uni.removeStorageSync('selectedMeals')
					
					uni.showModal({
						title: '订单已创建',
						content: `订单号：${orderId}\n请完成微信支付`,
						showCancel: false,
						success: () => {
							uni.redirectTo({ url: '/pages/order/detail?id=' + orderId })
						}
					})
				}
			}
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: #f5f5f5;
	padding-bottom: 140rpx;
}

.section {
	background: #fff;
	margin: 20rpx;
	border-radius: 16rpx;
	padding: 24rpx;
}

.section-title {
	font-size: 30rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 24rpx;
}

.delivery-options {
	display: flex;
	justify-content: space-between;
}

.delivery-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 24rpx;
	background: #f5f5f5;
	border-radius: 12rpx;
	margin: 0 10rpx;
	border: 2rpx solid transparent;
}

.delivery-item:first-child {
	margin-left: 0;
}

.delivery-item:last-child {
	margin-right: 0;
}

.delivery-item.active {
	background: rgba(76, 217, 100, 0.1);
	border-color: #4CD964;
}

.delivery-icon {
	font-size: 48rpx;
	margin-bottom: 10rpx;
}

.delivery-name {
	font-size: 26rpx;
	color: #333;
}

.address-input {
	background: #f5f5f5;
	border-radius: 12rpx;
	padding: 24rpx;
}

.picker-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.picker-content text {
	font-size: 28rpx;
	color: #333;
}

.arrow {
	color: #999;
}

.input {
	width: 100%;
	height: 80rpx;
	font-size: 28rpx;
	border-bottom: 1rpx solid #eee;
}

.input:last-child {
	border-bottom: none;
}

.product-list {
	max-height: 400rpx;
	overflow-y: auto;
}

.product-item {
	display: flex;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.product-item:last-child {
	border-bottom: none;
}

.product-image {
	width: 120rpx;
	height: 120rpx;
	border-radius: 12rpx;
	margin-right: 20rpx;
}

.product-info {
	flex: 1;
}

.product-name {
	font-size: 28rpx;
	color: #333;
	display: block;
}

.product-spec {
	font-size: 24rpx;
	color: #999;
	display: block;
	margin-top: 8rpx;
}

.product-price-row {
	display: flex;
	justify-content: space-between;
	margin-top: 16rpx;
}

.product-price {
	font-size: 28rpx;
	color: #ff6b00;
	font-weight: bold;
}

.product-qty {
	font-size: 26rpx;
	color: #999;
}

.pay-options {
	display: flex;
	flex-direction: column;
}

.pay-item {
	display: flex;
	align-items: center;
	padding: 24rpx;
	background: #f5f5f5;
	border-radius: 12rpx;
	margin-bottom: 16rpx;
	border: 2rpx solid transparent;
}

.pay-item:last-child {
	margin-bottom: 0;
}

.pay-item.active {
	background: rgba(76, 217, 100, 0.1);
	border-color: #4CD964;
}

.pay-icon {
	font-size: 48rpx;
	margin-right: 20rpx;
}

.pay-info {
	flex: 1;
}

.pay-name {
	font-size: 28rpx;
	color: #333;
	display: block;
}

.pay-balance {
	font-size: 24rpx;
	color: #999;
	display: block;
	margin-top: 6rpx;
}

.pay-check {
	width: 44rpx;
	height: 44rpx;
	background: #4CD964;
	color: #fff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
}

.amount-section .amount-row {
	display: flex;
	justify-content: space-between;
	padding: 16rpx 0;
}

.amount-label {
	font-size: 28rpx;
	color: #666;
}

.amount-value {
	font-size: 28rpx;
	color: #333;
}

.amount-row.total {
	border-top: 1rpx solid #f0f0f0;
	padding-top: 24rpx;
	margin-top: 8rpx;
}

.pay-amount {
	color: #ff6b00;
	font-size: 36rpx;
	font-weight: bold;
}

.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 100rpx;
	background: #fff;
	display: flex;
	align-items: center;
	padding: 0 24rpx;
	box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
	padding-bottom: env(safe-area-inset-bottom);
}

.total-info {
	flex: 1;
}

.total-label {
	font-size: 28rpx;
	color: #333;
}

.total-price {
	font-size: 40rpx;
	color: #ff6b00;
	font-weight: bold;
}

.submit-btn {
	padding: 24rpx 60rpx;
	background: linear-gradient(135deg, #4CD964 0%, #5AC8FA 100%);
	color: #fff;
	font-size: 32rpx;
	font-weight: bold;
	border-radius: 44rpx;
}
</style>
