<template>
	<view class="container">
		<!-- 订单状态tabs -->
		<view class="tabs">
			<view 
				class="tab-item" 
				:class="{active: currentStatus === item.value}"
				v-for="item in statusTabs" 
				:key="item.value"
				@click="switchTab(item.value)"
			>
				<text>{{item.label}}</text>
			</view>
		</view>
		
		<!-- 订单列表 -->
		<view class="order-list">
			<view class="order-item" v-for="order in orderList" :key="order.id" @click="goDetail(order.id)">
				<view class="order-header">
					<text class="order-no">订单号：{{order.id}}</text>
					<text class="order-status" :class="'status-' + order.status">{{order.statusText}}</text>
				</view>
				
				<view class="goods-list">
					<view class="goods-item" v-for="goods in order.goods" :key="goods.id">
						<image :src="goods.image" mode="aspectFill" class="goods-img"></image>
						<view class="goods-info">
							<text class="goods-name">{{goods.name}}</text>
							<view class="goods-bottom">
								<text class="goods-price">¥{{goods.price}}</text>
								<text class="goods-count">x{{goods.count}}</text>
							</view>
						</view>
					</view>
				</view>
				
				<view class="order-footer">
					<text class="order-total">共{{getTotalCount(order)}}件商品 合计：<text class="total-price">¥{{order.totalPrice}}</text></text>
					<view class="order-actions">
						<button class="action-btn" v-if="order.status === 1" @click.stop="cancelOrder(order)">取消订单</button>
						<button class="action-btn primary" v-if="order.status === 1" @click.stop="payOrder(order)">去支付</button>
						<button class="action-btn" v-if="order.status === 5" @click.stop="buyAgain(order)">再次购买</button>
					</view>
				</view>
			</view>
		</view>
		
		<view class="empty" v-if="!orderList.length">
			<text class="empty-icon">📋</text>
			<text class="empty-text">暂无订单</text>
		</view>
	</view>
</template>

<script>
import api from '@/api/index.js'

export default {
	data() {
		return {
			currentStatus: 0,
			statusTabs: [
				{ label: '全部', value: 0 },
				{ label: '待支付', value: 1 },
				{ label: '待发货', value: 2 },
				{ label: '待收货', value: 3 },
				{ label: '已完成', value: 5 }
			],
			orderList: []
		}
	},
	onLoad(options) {
		this.currentStatus = Number(options.status) || 0
		this.loadOrders()
	},
	onShow() {
		this.loadOrders()
	},
	methods: {
		async loadOrders() {
			const res = await api.getOrders(this.currentStatus || null)
			this.orderList = res.data
		},
		switchTab(status) {
			this.currentStatus = status
			this.loadOrders()
		},
		getTotalCount(order) {
			return order.goods.reduce((sum, g) => sum + g.count, 0)
		},
		goDetail(id) {
			uni.navigateTo({ url: '/pages/order/detail?id=' + id })
		},
		async cancelOrder(order) {
			uni.showModal({
				title: '提示',
				content: '确定取消该订单吗？',
				success: async (res) => {
					if (res.confirm) {
						await api.cancelOrder(order.id)
						uni.showToast({ title: '已取消', icon: 'success' })
						this.loadOrders()
					}
				}
			})
		},
		payOrder(order) {
			uni.navigateTo({ url: '/pages/order/detail?id=' + order.id + '&pay=1' })
		},
		buyAgain(order) {
			uni.setStorageSync('orderGoods', order.goods)
			uni.navigateTo({ url: '/pages/order/confirm' })
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
	padding: 8rpx 10rpx;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
	position: sticky;
	top: 0;
	z-index: 10;
}
.tab-item {
	flex: 1;
	text-align: center;
	padding: 24rpx 0;
	font-size: 28rpx;
	color: #666;
	position: relative;
	transition: all 0.2s;
}
.tab-item.active {
	color: #111;
	font-weight: bold;
}
.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: 4rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 48rpx;
	height: 6rpx;
	background: #111;
	border-radius: 3rpx;
}
.order-list {
	padding: 20rpx;
}
.order-item {
	background: #fff;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
}
.order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx;
	border-bottom: 1rpx solid #f5f5f5;
	background: #fafafa;
}
.order-no {
	font-size: 26rpx;
	color: #666;
}
.order-status {
	font-size: 26rpx;
	font-weight: bold;
	padding: 6rpx 16rpx;
	border-radius: 8rpx;
}
.status-1 { color: #FF9800; background: #FFF8E1; }
.status-2 { color: #2196F3; background: #E3F2FD; }
.status-3 { color: #4CAF50; background: #E8F5E9; }
.status-5 { color: #999; background: #f5f5f5; }
.goods-list {
	padding: 24rpx;
}
.goods-item {
	display: flex;
	margin-bottom: 20rpx;
}
.goods-item:last-child {
	margin-bottom: 0;
}
.goods-img {
	width: 160rpx;
	height: 160rpx;
	border-radius: 12rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.08);
}
.goods-info {
	flex: 1;
	margin-left: 20rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.goods-name {
	font-size: 28rpx;
	color: #333;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	font-weight: 500;
	line-height: 1.4;
}
.goods-bottom {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.goods-price {
	font-size: 30rpx;
	color: #FF4444;
	font-weight: bold;
}
.goods-count {
	font-size: 26rpx;
	color: #999;
	background: #f5f5f5;
	padding: 4rpx 16rpx;
	border-radius: 8rpx;
}
.order-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx;
	border-top: 1rpx solid #f5f5f5;
}
.order-total {
	font-size: 26rpx;
	color: #666;
}
.total-price {
	color: #FF4444;
	font-weight: bold;
	font-size: 30rpx;
}
.order-actions {
	display: flex;
}
.action-btn {
	padding: 14rpx 28rpx;
	font-size: 26rpx;
	border-radius: 32rpx;
	margin-left: 16rpx;
	background: #fff;
	border: 2rpx solid #ddd;
	color: #666;
	transition: all 0.2s;
}
.action-btn:active {
	background: #f5f5f5;
}
.action-btn.primary {
	background: #111;
	border-color: transparent;
	color: #fff;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.18);
}
.action-btn.primary:active {
	transform: scale(0.98);
}
.empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 200rpx;
}
.empty-icon {
	font-size: 140rpx;
	opacity: 0.5;
}
.empty-text {
	font-size: 30rpx;
	color: #999;
	margin-top: 24rpx;
}
</style>
