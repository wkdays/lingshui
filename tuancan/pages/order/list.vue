<template>
	<view class="container">
		<!-- 订单状态tabs -->
		<view class="tabs">
			<view 
				class="tab-item" 
				:class="{active: currentTab === -1}" 
				@click="switchTab(-1)">全部</view>
			<view 
				class="tab-item" 
				:class="{active: currentTab === 0}" 
				@click="switchTab(0)">待支付</view>
			<view 
				class="tab-item" 
				:class="{active: currentTab === 1}" 
				@click="switchTab(1)">待发货</view>
			<view 
				class="tab-item" 
				:class="{active: currentTab === 3}" 
				@click="switchTab(3)">配送中</view>
			<view 
				class="tab-item" 
				:class="{active: currentTab === 4}" 
				@click="switchTab(4)">已完成</view>
		</view>
		
		<!-- 订单列表 -->
		<scroll-view class="order-list" scroll-y>
			<view class="empty" v-if="orderList.length === 0">
				<text class="empty-text">暂无订单</text>
			</view>
			<view class="order-item" v-for="order in orderList" :key="order.id" @click="goDetail(order.id)">
				<view class="order-header">
					<text class="order-id">订单号：{{order.id}}</text>
					<text class="order-status" :class="'status-' + order.status">{{order.statusText}}</text>
				</view>
				<view class="order-products">
					<view class="product-row" v-for="(product, index) in order.products.slice(0, 2)" :key="index">
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
					<view class="more-products" v-if="order.products.length > 2">
						<text>共{{order.products.length}}件商品</text>
					</view>
				</view>
				<view class="order-footer">
					<text class="order-total">实付：<text class="price">¥{{order.payAmount.toFixed(2)}}</text></text>
					<view class="order-actions">
						<view class="action-btn" v-if="order.status === 0" @click.stop="payOrder(order)">去支付</view>
						<view class="action-btn" v-if="order.status === 0" @click.stop="cancelOrder(order)">取消</view>
						<view class="action-btn" v-if="order.status === 3" @click.stop="confirmOrder(order)">确认收货</view>
						<view class="action-btn ghost" @click.stop="goDetail(order.id)">查看详情</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { orderApi } from '@/api/mock.js'

export default {
	data() {
		return {
			currentTab: -1,
			orderList: []
		}
	},
	onShow() {
		this.loadOrders()
	},
	methods: {
		async loadOrders() {
			uni.showLoading({ title: '加载中...' })
			const res = await orderApi.getOrderList(this.currentTab)
			uni.hideLoading()
			if (res.code === 0) {
				this.orderList = res.data
			}
		},
		switchTab(tab) {
			this.currentTab = tab
			this.loadOrders()
		},
		goDetail(orderId) {
			uni.navigateTo({ url: '/pages/order/detail?id=' + orderId })
		},
		async payOrder(order) {
			uni.showModal({
				title: '确认支付',
				content: `确认支付¥${order.payAmount.toFixed(2)}？`,
				success: async (res) => {
					if (res.confirm) {
						const result = await orderApi.payOrder(order.id, 0)
						if (result.code === 0) {
							uni.showToast({ title: '支付成功', icon: 'success' })
							this.loadOrders()
						}
					}
				}
			})
		},
		async cancelOrder(order) {
			uni.showModal({
				title: '取消订单',
				content: '确认取消该订单？',
				success: async (res) => {
					if (res.confirm) {
						const result = await orderApi.cancelOrder(order.id)
						if (result.code === 0) {
							uni.showToast({ title: '已取消', icon: 'success' })
							this.loadOrders()
						}
					}
				}
			})
		},
		async confirmOrder(order) {
			uni.showModal({
				title: '确认收货',
				content: '确认已收到货物？',
				success: async (res) => {
					if (res.confirm) {
						const result = await orderApi.confirmOrder(order.id)
						if (result.code === 0) {
							uni.showToast({ title: '已确认', icon: 'success' })
							this.loadOrders()
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
}

.tabs {
	display: flex;
	background: #fff;
	padding: 0 10rpx;
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

.order-list {
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

.order-item {
	background: #fff;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
}

.order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.order-id {
	font-size: 26rpx;
	color: #666;
}

.order-status {
	font-size: 26rpx;
	font-weight: bold;
}

.status-0 { color: #ff9500; }
.status-1 { color: #4CD964; }
.status-2 { color: #5AC8FA; }
.status-3 { color: #007AFF; }
.status-4 { color: #8E8E93; }
.status-5 { color: #FF3B30; }

.order-products {
	padding: 20rpx 24rpx;
}

.product-row {
	display: flex;
	align-items: center;
	padding: 12rpx 0;
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

.more-products {
	text-align: center;
	padding: 16rpx;
	font-size: 24rpx;
	color: #999;
}

.order-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 24rpx;
	border-top: 1rpx solid #f0f0f0;
}

.order-total {
	font-size: 26rpx;
	color: #666;
}

.order-total .price {
	font-size: 32rpx;
	color: #ff6b00;
	font-weight: bold;
}

.order-actions {
	display: flex;
}

.action-btn {
	padding: 12rpx 28rpx;
	font-size: 26rpx;
	color: #fff;
	background: linear-gradient(135deg, #4CD964 0%, #5AC8FA 100%);
	border-radius: 30rpx;
	margin-left: 16rpx;
}

.action-btn.ghost {
	background: none;
	color: #666;
	border: 1rpx solid #ddd;
}
</style>
