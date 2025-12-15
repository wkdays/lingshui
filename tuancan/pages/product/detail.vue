<template>
	<view class="container">
		<!-- 商品图片 -->
		<swiper class="product-swiper" indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff">
			<swiper-item>
				<image class="product-img" :src="product.image" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		
		<!-- 特价标签 -->
		<view class="special-banner" v-if="product.isSpecial">
			<text class="special-text">🏷️ 限时特价</text>
			<text class="special-save">立省¥{{(product.originalPrice - product.price).toFixed(2)}}</text>
		</view>
		
		<!-- 商品信息 -->
		<view class="product-info">
			<view class="price-row">
				<text class="price-symbol">¥</text>
				<text class="price">{{product.price}}</text>
				<text class="original-price" v-if="product.isSpecial">¥{{product.originalPrice}}</text>
			</view>
			<text class="product-name">{{product.name}}</text>
			<text class="product-desc">{{product.description}}</text>
			<view class="product-meta">
				<text class="meta-item">销量 {{product.sales}}</text>
				<text class="meta-item">库存 {{product.stock}}</text>
			</view>
		</view>
		
		<!-- 规格选择 -->
		<view class="section">
			<view class="section-title">选择规格</view>
			<view class="spec-list">
				<view 
					class="spec-item" 
					:class="{active: selectedSpec === spec}" 
					v-for="spec in product.specs" 
					:key="spec"
					@click="selectSpec(spec)">
					{{spec}}
				</view>
			</view>
		</view>
		
		<!-- 数量选择 -->
		<view class="section">
			<view class="section-title">购买数量</view>
			<view class="quantity-control">
				<view class="qty-btn" @click="changeQty(-1)">-</view>
				<text class="qty-num">{{quantity}}</text>
				<view class="qty-btn" @click="changeQty(1)">+</view>
			</view>
		</view>
		
		<!-- 底部操作 -->
		<view class="bottom-bar">
			<view class="action-icons">
				<view class="icon-item" @click="goCart">
					<text class="icon">🛒</text>
					<text class="icon-text">购物车</text>
					<view class="badge" v-if="cartCount > 0">{{cartCount}}</view>
				</view>
			</view>
			<view class="action-btns">
				<view class="add-cart-btn" @click="addToCart">加入购物车</view>
				<view class="buy-btn" @click="buyNow">立即购买</view>
			</view>
		</view>
	</view>
</template>

<script>
import { productApi, cartApi } from '@/api/mock.js'
import store from '@/store/index.js'

export default {
	data() {
		return {
			productId: 0,
			product: {
				specs: []
			},
			selectedSpec: '',
			quantity: 1
		}
	},
	computed: {
		cartCount() {
			return store.cartCount
		}
	},
	onLoad(options) {
		this.productId = parseInt(options.id)
		this.loadProduct()
	},
	methods: {
		async loadProduct() {
			const res = await productApi.getProductDetail(this.productId)
			if (res.code === 0) {
				this.product = res.data
				if (this.product.specs && this.product.specs.length > 0) {
					this.selectedSpec = this.product.specs[0]
				}
			}
		},
		selectSpec(spec) {
			this.selectedSpec = spec
		},
		changeQty(delta) {
			const newQty = this.quantity + delta
			if (newQty < 1) return
			if (newQty > this.product.stock) {
				uni.showToast({ title: '库存不足', icon: 'none' })
				return
			}
			this.quantity = newQty
		},
		async addToCart() {
			if (!this.selectedSpec) {
				uni.showToast({ title: '请选择规格', icon: 'none' })
				return
			}
			await cartApi.addToCart(this.product, this.quantity, this.selectedSpec)
			store.addToCart(this.product, this.quantity, this.selectedSpec)
			uni.showToast({ title: '已加入购物车', icon: 'success' })
		},
		buyNow() {
			if (!this.selectedSpec) {
				uni.showToast({ title: '请选择规格', icon: 'none' })
				return
			}
			const item = {
				...this.product,
				quantity: this.quantity,
				spec: this.selectedSpec,
				checked: true
			}
			uni.setStorageSync('checkoutItems', [item])
			uni.navigateTo({ url: '/pages/order/confirm?from=buy' })
		},
		goCart() {
			uni.switchTab({ url: '/pages/cart/cart' })
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

.product-swiper {
	width: 100%;
	height: 600rpx;
}

.product-img {
	width: 100%;
	height: 100%;
}

.special-banner {
	background: linear-gradient(135deg, #FF3B30 0%, #FF9500 100%);
	padding: 20rpx 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.special-text {
	font-size: 28rpx;
	color: #fff;
	font-weight: bold;
}

.special-save {
	font-size: 26rpx;
	color: #fff;
}

.product-info {
	background: #fff;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.price-row {
	display: flex;
	align-items: baseline;
	margin-bottom: 16rpx;
}

.price-symbol {
	font-size: 28rpx;
	color: #ff6b00;
	font-weight: bold;
}

.price {
	font-size: 52rpx;
	color: #ff6b00;
	font-weight: bold;
}

.original-price {
	font-size: 28rpx;
	color: #999;
	text-decoration: line-through;
	margin-left: 16rpx;
}

.product-name {
	font-size: 34rpx;
	color: #333;
	font-weight: bold;
	display: block;
	margin-bottom: 12rpx;
}

.product-desc {
	font-size: 28rpx;
	color: #666;
	display: block;
	line-height: 1.6;
	margin-bottom: 16rpx;
}

.product-meta {
	display: flex;
}

.meta-item {
	font-size: 24rpx;
	color: #999;
	margin-right: 30rpx;
}

.section {
	background: #fff;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 30rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 24rpx;
}

.spec-list {
	display: flex;
	flex-wrap: wrap;
}

.spec-item {
	padding: 16rpx 36rpx;
	font-size: 28rpx;
	color: #666;
	background: #f5f5f5;
	border-radius: 8rpx;
	margin-right: 20rpx;
	margin-bottom: 16rpx;
	border: 2rpx solid transparent;
}

.spec-item.active {
	color: #4CD964;
	background: rgba(76, 217, 100, 0.1);
	border-color: #4CD964;
}

.quantity-control {
	display: flex;
	align-items: center;
}

.qty-btn {
	width: 64rpx;
	height: 64rpx;
	background: #f5f5f5;
	border-radius: 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	color: #333;
}

.qty-num {
	width: 100rpx;
	text-align: center;
	font-size: 32rpx;
	color: #333;
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

.action-icons {
	display: flex;
	margin-right: 20rpx;
}

.icon-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 20rpx;
	position: relative;
}

.icon {
	font-size: 40rpx;
}

.icon-text {
	font-size: 20rpx;
	color: #666;
}

.badge {
	position: absolute;
	top: -6rpx;
	right: 6rpx;
	background: #FF3B30;
	color: #fff;
	font-size: 18rpx;
	min-width: 28rpx;
	height: 28rpx;
	line-height: 28rpx;
	text-align: center;
	border-radius: 14rpx;
}

.action-btns {
	flex: 1;
	display: flex;
}

.add-cart-btn {
	flex: 1;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	background: #ff9500;
	color: #fff;
	font-size: 28rpx;
	border-radius: 40rpx 0 0 40rpx;
}

.buy-btn {
	flex: 1;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	background: linear-gradient(135deg, #4CD964 0%, #5AC8FA 100%);
	color: #fff;
	font-size: 28rpx;
	border-radius: 0 40rpx 40rpx 0;
}
</style>
