<template>
	<view class="container">
		<!-- 空购物车 -->
		<view class="empty-cart" v-if="cartList.length === 0">
			<text class="empty-emoji">🛒</text>
			<text class="empty-text">购物车空空如也</text>
			<text class="empty-sub">快去挑选心仪的美食吧</text>
			<view class="go-shop-btn" @click="goShop">去逛逛</view>
		</view>
		
		<!-- 购物车列表 -->
		<view class="cart-list" v-else>
			<view class="cart-item" v-for="(item, index) in cartList" :key="index">
				<view class="check-box" @click="toggleCheck(index)">
					<view class="check-icon" :class="{checked: item.checked}">✓</view>
				</view>
				<image class="item-image" :src="item.image" mode="aspectFill"></image>
				<view class="item-info">
					<text class="item-name">{{item.name}}</text>
					<text class="item-spec" v-if="item.spec">规格：{{item.spec}}</text>
					<view class="item-price-row">
						<text class="item-price">¥{{item.price}}</text>
						<view class="quantity-control">
							<view class="qty-btn" @click="changeQuantity(index, -1)">-</view>
							<text class="qty-num">{{item.quantity}}</text>
							<view class="qty-btn" @click="changeQuantity(index, 1)">+</view>
						</view>
					</view>
				</view>
				<view class="delete-btn" @click="deleteItem(index)">×</view>
			</view>
		</view>
		
		<!-- 底部结算栏 -->
		<view class="bottom-bar" v-if="cartList.length > 0">
			<view class="select-all" @click="toggleSelectAll">
				<view class="check-icon" :class="{checked: isAllSelected}">✓</view>
				<text>全选</text>
			</view>
			<view class="total-info">
				<text class="total-label">合计：</text>
				<text class="total-price">¥{{totalPrice.toFixed(2)}}</text>
			</view>
			<view class="checkout-btn" :class="{disabled: selectedCount === 0}" @click="checkout">
				结算({{selectedCount}})
			</view>
		</view>
	</view>
</template>

<script>
import { cartApi } from '@/api/mock.js'
import store from '@/store/index.js'

export default {
	data() {
		return {
			cartList: []
		}
	},
	computed: {
		isAllSelected() {
			return this.cartList.length > 0 && this.cartList.every(item => item.checked)
		},
		selectedCount() {
			return this.cartList.filter(item => item.checked).reduce((sum, item) => sum + item.quantity, 0)
		},
		totalPrice() {
			return this.cartList.filter(item => item.checked).reduce((sum, item) => sum + item.price * item.quantity, 0)
		}
	},
	onShow() {
		this.loadCart()
	},
	methods: {
		async loadCart() {
			const res = await cartApi.getCart()
			if (res.code === 0) {
				this.cartList = res.data
			}
		},
		toggleCheck(index) {
			this.cartList[index].checked = !this.cartList[index].checked
		},
		toggleSelectAll() {
			const allChecked = this.isAllSelected
			this.cartList.forEach(item => {
				item.checked = !allChecked
			})
		},
		async changeQuantity(index, delta) {
			const item = this.cartList[index]
			const newQty = item.quantity + delta
			if (newQty < 1) {
				this.deleteItem(index)
				return
			}
			item.quantity = newQty
			await cartApi.updateCartItem(item.id, newQty, item.spec)
		},
		async deleteItem(index) {
			const item = this.cartList[index]
			uni.showModal({
				title: '提示',
				content: '确定删除该商品吗？',
				success: async (res) => {
					if (res.confirm) {
						await cartApi.removeFromCart(item.id, item.spec)
						this.cartList.splice(index, 1)
					}
				}
			})
		},
		goShop() {
			uni.switchTab({ url: '/pages/index/index' })
		},
		checkout() {
			if (this.selectedCount === 0) {
				uni.showToast({ title: '请选择商品', icon: 'none' })
				return
			}
			const selectedItems = this.cartList.filter(item => item.checked)
			uni.setStorageSync('checkoutItems', selectedItems)
			uni.navigateTo({ url: '/pages/order/confirm?from=cart' })
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

.empty-cart {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 200rpx;
}

.empty-emoji {
	font-size: 120rpx;
	margin-bottom: 30rpx;
	opacity: 0.6;
}

.empty-text {
	font-size: 32rpx;
	color: #333;
	font-weight: 500;
	margin-bottom: 16rpx;
}

.empty-sub {
	font-size: 26rpx;
	color: #999;
	margin-bottom: 50rpx;
}

.go-shop-btn {
	padding: 24rpx 80rpx;
	background: linear-gradient(135deg, #34D399 0%, #10B981 100%);
	color: #fff;
	font-size: 30rpx;
	font-weight: 500;
	border-radius: 50rpx;
	box-shadow: 0 8rpx 24rpx rgba(16, 185, 129, 0.3);
}

.cart-list {
	padding: 20rpx;
}

.cart-item {
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
	position: relative;
}

.check-box {
	margin-right: 20rpx;
}

.check-icon {
	width: 44rpx;
	height: 44rpx;
	border: 2rpx solid #ddd;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	color: transparent;
}

.check-icon.checked {
	background: #10B981;
	border-color: #10B981;
	color: #fff;
}

.item-image {
	width: 160rpx;
	height: 160rpx;
	border-radius: 12rpx;
	margin-right: 20rpx;
}

.item-info {
	flex: 1;
}

.item-name {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
	display: block;
	margin-bottom: 8rpx;
}

.item-spec {
	font-size: 24rpx;
	color: #999;
	display: block;
	margin-bottom: 16rpx;
}

.item-price-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.item-price {
	font-size: 32rpx;
	color: #ff6b00;
	font-weight: bold;
}

.quantity-control {
	display: flex;
	align-items: center;
}

.qty-btn {
	width: 50rpx;
	height: 50rpx;
	background: #f5f5f5;
	border-radius: 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	color: #666;
}

.qty-num {
	width: 60rpx;
	text-align: center;
	font-size: 28rpx;
	color: #333;
}

.delete-btn {
	position: absolute;
	top: 16rpx;
	right: 16rpx;
	font-size: 40rpx;
	color: #ccc;
}

.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 110rpx;
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 32rpx;
	box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
	padding-bottom: env(safe-area-inset-bottom);
}

.select-all {
	display: flex;
	align-items: center;
	flex-shrink: 0;
}

.select-all text {
	font-size: 28rpx;
	color: #333;
	margin-left: 12rpx;
}

.total-info {
	flex: 1;
	display: flex;
	align-items: baseline;
	justify-content: center;
	padding: 0 20rpx;
}

.total-label {
	font-size: 28rpx;
	color: #666;
}

.total-price {
	font-size: 40rpx;
	color: #ff6b00;
	font-weight: bold;
	margin-left: 4rpx;
}

.checkout-btn {
	min-width: 200rpx;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	background: linear-gradient(135deg, #34D399 0%, #10B981 100%);
	color: #fff;
	font-size: 30rpx;
	font-weight: 600;
	border-radius: 40rpx;
	flex-shrink: 0;
}

.checkout-btn.disabled {
	opacity: 0.5;
	background: #ccc;
}
</style>
