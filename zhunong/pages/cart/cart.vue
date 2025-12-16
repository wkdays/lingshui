<template>
	<view class="container">
		<view class="cart-list" v-if="cartList.length">
			<view class="cart-item" v-for="item in cartList" :key="item.id">
				<checkbox :checked="item.selected" @click="toggleSelect(item)" />
				<image :src="item.image" mode="aspectFill" class="goods-img" @click="goDetail(item.goodsId)"></image>
				<view class="goods-info">
					<text class="goods-name">{{item.name}}</text>
					<text class="goods-shop">{{item.shopName}}</text>
					<view class="price-row">
						<text class="goods-price">¥{{item.price}}</text>
						<view class="count-box">
							<view class="count-btn" @click="changeCount(item, -1)">-</view>
							<text class="count-num">{{item.count}}</text>
							<view class="count-btn" @click="changeCount(item, 1)">+</view>
						</view>
					</view>
				</view>
				<view class="delete-btn" @click="deleteItem(item)">🗑️</view>
			</view>
		</view>
		
		<view class="empty" v-else>
			<text class="empty-icon">🛒</text>
			<text class="empty-text">购物车空空如也</text>
			<button class="go-shop-btn" @click="goShop">去逛逛</button>
		</view>
		
		<view class="bottom-bar" v-if="cartList.length">
			<view class="select-all" @click="toggleSelectAll">
				<checkbox :checked="isAllSelected" />
				<text>全选</text>
			</view>
			<view class="total-area">
				<text>合计：</text>
				<text class="total-price">¥{{totalPrice.toFixed(2)}}</text>
			</view>
			<button class="submit-btn" :disabled="!selectedCount" @click="submitOrder">
				结算({{selectedCount}})
			</button>
		</view>
		
		<!-- 自定义tabbar -->
		<custom-tabbar :current="2"></custom-tabbar>
	</view>
</template>

<script>
import api from '@/api/index.js'
import storage from '@/utils/storage.js'
import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue'

export default {
	components: {
		CustomTabbar
	},
	data() {
		return {
			cartList: []
		}
	},
	computed: {
		isAllSelected() {
			return this.cartList.length && this.cartList.every(item => item.selected)
		},
		selectedCount() {
			return this.cartList.filter(item => item.selected).reduce((sum, item) => sum + item.count, 0)
		},
		totalPrice() {
			return this.cartList.filter(item => item.selected).reduce((sum, item) => sum + item.price * item.count, 0)
		}
	},
	onShow() {
		this.loadCart()
	},
	methods: {
		async loadCart() {
			const res = await api.getCart()
			this.cartList = res.data
		},
		async toggleSelect(item) {
			item.selected = !item.selected
			await api.updateCart({ id: item.id, selected: item.selected })
		},
		async toggleSelectAll() {
			const allSelected = this.isAllSelected
			this.cartList.forEach(item => item.selected = !allSelected)
			storage.setCart(this.cartList)
		},
		async changeCount(item, delta) {
			if (item.count + delta < 1) {
				this.deleteItem(item)
				return
			}
			item.count += delta
			await api.updateCart({ id: item.id, count: item.count })
		},
		async deleteItem(item) {
			uni.showModal({
				title: '提示',
				content: '确定删除该商品吗？',
				success: async (res) => {
					if (res.confirm) {
						await api.deleteCartItem(item.id)
						this.cartList = this.cartList.filter(i => i.id !== item.id)
					}
				}
			})
		},
		goDetail(id) {
			uni.navigateTo({ url: '/pages/goods/detail?id=' + id })
		},
		goShop() {
			uni.switchTab({ url: '/pages/index/index' })
		},
		submitOrder() {
			if (!storage.getToken()) {
				uni.showToast({ title: '请先登录', icon: 'none' })
				uni.navigateTo({ url: '/pages/login/login' })
				return
			}
			const selectedItems = this.cartList.filter(item => item.selected)
			if (!selectedItems.length) {
				uni.showToast({ title: '请选择商品', icon: 'none' })
				return
			}
			uni.setStorageSync('orderGoods', selectedItems)
			uni.navigateTo({ url: '/pages/order/confirm' })
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: #f5f5f5;
	padding-bottom: 360rpx;
}
.cart-list {
	padding: 20rpx;
}
.cart-item {
	display: flex;
	align-items: center;
	background: #fff;
	padding: 24rpx 20rpx;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
	transition: transform 0.2s;
}
.cart-item:active {
	transform: scale(0.99);
}
.goods-img {
	width: 180rpx;
	height: 180rpx;
	border-radius: 12rpx;
	margin: 0 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.08);
}
.goods-info {
	flex: 1;
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
.goods-shop {
	font-size: 22rpx;
	color: #999;
	margin-top: 10rpx;
	display: block;
	padding: 4rpx 12rpx;
	background: #f8f8f8;
	border-radius: 6rpx;
	display: inline-block;
}
.price-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 20rpx;
}
.goods-price {
	font-size: 34rpx;
	color: #FF4444;
	font-weight: bold;
}
.count-box {
	display: flex;
	align-items: center;
	background: #f8f8f8;
	border-radius: 24rpx;
	padding: 4rpx;
}
.count-btn {
	width: 52rpx;
	height: 52rpx;
	background: #fff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	color: #666;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.06);
	transition: all 0.15s;
}
.count-btn:active {
	background: #111;
	color: #fff;
}
.count-num {
	width: 70rpx;
	text-align: center;
	font-size: 30rpx;
	font-weight: 500;
}
.delete-btn {
	padding: 20rpx 16rpx;
	font-size: 36rpx;
	opacity: 0.6;
	transition: opacity 0.2s;
}
.delete-btn:active {
	opacity: 1;
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
.go-shop-btn {
	margin-top: 48rpx;
	background: #111;
	color: #fff;
	border-radius: 44rpx;
	padding: 0 80rpx;
	font-size: 30rpx;
	height: 88rpx;
	line-height: 88rpx;
	box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.18);
}
.bottom-bar {
	position: fixed;
	bottom: calc(176rpx + constant(safe-area-inset-bottom));
	bottom: calc(176rpx + env(safe-area-inset-bottom));
	left: 0;
	right: 0;
	background: #fff;
	display: flex;
	align-items: center;
	min-height: 110rpx;
	padding: 16rpx 24rpx;
	box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.08);
	padding-bottom: calc(constant(safe-area-inset-bottom) + 16rpx);
	padding-bottom: calc(env(safe-area-inset-bottom) + 16rpx);
}
.select-all {
	display: flex;
	align-items: center;
	font-size: 28rpx;
	color: #666;
}
.total-area {
	flex: 1;
	text-align: right;
	padding-right: 24rpx;
	font-size: 28rpx;
	color: #666;
}
.total-price {
	font-size: 38rpx;
	color: #FF4444;
	font-weight: bold;
}
.submit-btn {
	background: #111;
	color: #fff;
	border-radius: 44rpx;
	padding: 0 48rpx;
	height: 80rpx;
	line-height: 80rpx;
	font-size: 30rpx;
	font-weight: 500;
	box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.18);
}
.submit-btn[disabled] {
	background: #ddd;
	box-shadow: none;
}
</style>
