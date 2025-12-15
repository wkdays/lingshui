<template>
	<view class="container">
		<!-- 订单状态 -->
		<view class="status-section">
			<view class="status-icon">
				<text v-if="order.status === 0">⏳</text>
				<text v-else-if="order.status === 1">📦</text>
				<text v-else-if="order.status === 2">🏪</text>
				<text v-else-if="order.status === 3">🚚</text>
				<text v-else-if="order.status === 4">✅</text>
				<text v-else>❌</text>
			</view>
			<text class="status-text">{{order.statusText}}</text>
			<text class="status-time">{{order.createTime}}</text>
		</view>
		
		<!-- 收货信息 -->
		<view class="section">
			<view class="section-title">
				<text class="icon">📍</text>
				{{deliveryTypeText}}
			</view>
			<text class="address-text">{{order.deliveryAddress}}</text>
		</view>
		
		<!-- 商品列表 -->
		<view class="section">
			<view class="section-title">
				<text class="icon">🛒</text>
				商品信息
			</view>
			<view class="product-list">
				<view class="product-item" v-for="(product, index) in order.products" :key="index">
					<image class="product-img" :src="product.image" mode="aspectFill"></image>
					<view class="product-info">
						<text class="product-name">{{product.name}}</text>
						<text class="product-spec">{{product.spec}}</text>
					</view>
					<view class="product-right">
						<text class="product-price">¥{{product.price}}</text>
						<text class="product-qty">x{{product.quantity}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 订单信息 -->
		<view class="section">
			<view class="section-title">
				<text class="icon">📋</text>
				订单信息
			</view>
			<view class="info-list">
				<view class="info-row">
					<text class="info-label">订单编号</text>
					<text class="info-value">{{order.id}}</text>
				</view>
				<view class="info-row">
					<text class="info-label">下单时间</text>
					<text class="info-value">{{order.createTime}}</text>
				</view>
				<view class="info-row" v-if="order.payTime">
					<text class="info-label">支付时间</text>
					<text class="info-value">{{order.payTime}}</text>
				</view>
			</view>
		</view>
		
		<!-- 金额明细 -->
		<view class="section">
			<view class="section-title">
				<text class="icon">💰</text>
				金额明细
			</view>
			<view class="info-list">
				<view class="info-row">
					<text class="info-label">商品金额</text>
					<text class="info-value">¥{{order.totalAmount?.toFixed(2)}}</text>
				</view>
				<view class="info-row">
					<text class="info-label">配送费</text>
					<text class="info-value">¥{{(order.payAmount - order.totalAmount)?.toFixed(2) || '0.00'}}</text>
				</view>
				<view class="info-row total">
					<text class="info-label">实付金额</text>
					<text class="info-value price">¥{{order.payAmount?.toFixed(2)}}</text>
				</view>
			</view>
		</view>
		
		<!-- 底部操作 -->
		<view class="bottom-bar" v-if="order.status === 0 || order.status === 3">
			<view class="action-btn ghost" v-if="order.status === 0" @click="cancelOrder">取消订单</view>
			<view class="action-btn primary" v-if="order.status === 0" @click="payOrder">去支付</view>
			<view class="action-btn primary" v-if="order.status === 3" @click="confirmOrder">确认收货</view>
		</view>
	</view>
</template>

<script>
import { orderApi } from '@/api/mock.js'

export default {
	data() {
		return {
			orderId: '',
			order: {}
		}
	},
	computed: {
		deliveryTypeText() {
			const types = ['自提点', '驿站地址', '收货地址']
			return types[this.order.deliveryType] || '收货信息'
		}
	},
	onLoad(options) {
		this.orderId = options.id
		this.loadOrder()
	},
	methods: {
		async loadOrder() {
			uni.showLoading({ title: '加载中...' })
			const res = await orderApi.getOrderDetail(this.orderId)
			uni.hideLoading()
			if (res.code === 0) {
				this.order = res.data
			}
		},
		async payOrder() {
			uni.showModal({
				title: '确认支付',
				content: `确认支付¥${this.order.payAmount.toFixed(2)}？`,
				success: async (res) => {
					if (res.confirm) {
						const result = await orderApi.payOrder(this.orderId, 0)
						if (result.code === 0) {
							uni.showToast({ title: '支付成功', icon: 'success' })
							this.loadOrder()
						}
					}
				}
			})
		},
		async cancelOrder() {
			uni.showModal({
				title: '取消订单',
				content: '确认取消该订单？\n（注：当天订单无法取消）',
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '处理中...' })
						const result = await orderApi.cancelOrder(this.orderId)
						uni.hideLoading()
						if (result.code === 0) {
							uni.showToast({ title: '已取消并退款', icon: 'success' })
							this.loadOrder()
						} else {
							uni.showModal({
								title: '无法取消',
								content: result.msg || '当天订单无法取消，如需修改请联系客服',
								showCancel: false
							})
						}
					}
				}
			})
		},
		async confirmOrder() {
			uni.showModal({
				title: '确认收货',
				content: '确认已收到货物？',
				success: async (res) => {
					if (res.confirm) {
						const result = await orderApi.confirmOrder(this.orderId)
						if (result.code === 0) {
							uni.showToast({ title: '已确认', icon: 'success' })
							this.loadOrder()
						}
					}
				}
			})
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

.status-section {
	background: linear-gradient(135deg, #4CD964 0%, #5AC8FA 100%);
	padding: 60rpx 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.status-icon {
	font-size: 80rpx;
	margin-bottom: 20rpx;
}

.status-text {
	font-size: 36rpx;
	color: #fff;
	font-weight: bold;
	margin-bottom: 10rpx;
}

.status-time {
	font-size: 26rpx;
	color: rgba(255,255,255,0.8);
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
	margin-bottom: 20rpx;
	display: flex;
	align-items: center;
}

.section-title .icon {
	margin-right: 12rpx;
}

.address-text {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
}

.product-list {
	max-height: 400rpx;
	overflow-y: auto;
}

.product-item {
	display: flex;
	align-items: center;
	padding: 16rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.product-item:last-child {
	border-bottom: none;
}

.product-img {
	width: 100rpx;
	height: 100rpx;
	border-radius: 8rpx;
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
	margin-top: 6rpx;
}

.product-right {
	text-align: right;
}

.product-price {
	font-size: 28rpx;
	color: #333;
	display: block;
}

.product-qty {
	font-size: 24rpx;
	color: #999;
	display: block;
}

.info-list {
	padding: 0;
}

.info-row {
	display: flex;
	justify-content: space-between;
	padding: 16rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.info-row:last-child {
	border-bottom: none;
}

.info-label {
	font-size: 28rpx;
	color: #999;
}

.info-value {
	font-size: 28rpx;
	color: #333;
}

.info-row.total .info-value.price {
	font-size: 36rpx;
	color: #ff6b00;
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
	justify-content: flex-end;
	align-items: center;
	padding: 0 24rpx;
	box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
	padding-bottom: env(safe-area-inset-bottom);
}

.action-btn {
	padding: 20rpx 40rpx;
	font-size: 28rpx;
	border-radius: 40rpx;
	margin-left: 20rpx;
}

.action-btn.ghost {
	color: #666;
	border: 1rpx solid #ddd;
	background: #fff;
}

.action-btn.primary {
	color: #fff;
	background: linear-gradient(135deg, #4CD964 0%, #5AC8FA 100%);
}
</style>
