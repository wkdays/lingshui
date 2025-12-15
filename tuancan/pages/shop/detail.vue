<template>
	<view class="container">
		<!-- 商家头部 -->
		<view class="shop-header">
			<image class="shop-bg" :src="shop.logo" mode="aspectFill"></image>
			<view class="shop-overlay"></view>
			<view class="shop-info">
				<image class="shop-logo" :src="shop.logo" mode="aspectFill"></image>
				<view class="shop-detail">
					<text class="shop-name">{{shop.name}}</text>
					<view class="shop-meta">
						<text class="shop-score">⭐ {{shop.score}}</text>
						<text class="shop-distance">{{shop.distance}}</text>
					</view>
					<view class="shop-tags">
						<text class="tag" v-for="tag in shop.tags" :key="tag">{{tag}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 分类和商品 -->
		<view class="main-content">
			<!-- 左侧分类 -->
			<scroll-view class="category-list" scroll-y>
				<view 
					class="category-item" 
					:class="{active: currentCategory === item.id}" 
					v-for="item in categories" 
					:key="item.id"
					@click="selectCategory(item.id)">
					{{item.name}}
				</view>
			</scroll-view>
			
			<!-- 右侧商品 -->
			<scroll-view class="product-list" scroll-y>
				<view class="product-item" v-for="product in productList" :key="product.id" @click="goProductDetail(product.id)">
					<image class="product-img" :src="product.image" mode="aspectFill"></image>
					<view class="product-info">
						<text class="product-name">{{product.name}}</text>
						<text class="product-desc">{{product.description}}</text>
						<view class="product-bottom">
							<view class="price-row">
								<text class="price">¥{{product.price}}</text>
								<text class="original-price" v-if="product.isSpecial">¥{{product.originalPrice}}</text>
							</view>
							<view class="add-btn" @click.stop="addToCart(product)">+</view>
						</view>
					</view>
					<view class="special-tag" v-if="product.isSpecial">特价</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 底部购物车 -->
		<view class="cart-bar" @click="goCart">
			<view class="cart-icon-wrap">
				<text class="cart-icon">🛒</text>
				<view class="cart-badge" v-if="cartCount > 0">{{cartCount}}</view>
			</view>
			<view class="cart-info">
				<text class="cart-total">¥{{cartTotal.toFixed(2)}}</text>
				<text class="cart-min">¥{{shop.minPrice}}起送</text>
			</view>
			<view class="checkout-btn" :class="{disabled: cartTotal < shop.minPrice}">
				{{cartTotal >= shop.minPrice ? '去结算' : '差¥' + (shop.minPrice - cartTotal).toFixed(2) + '起送'}}
			</view>
		</view>
	</view>
</template>

<script>
import { shopApi, productApi, cartApi } from '@/api/mock.js'
import store from '@/store/index.js'

export default {
	data() {
		return {
			shopId: 0,
			shop: {},
			categories: [],
			currentCategory: 1,
			productList: []
		}
	},
	computed: {
		cartCount() {
			return store.cartCount
		},
		cartTotal() {
			return store.cartTotal
		}
	},
	onLoad(options) {
		this.shopId = parseInt(options.id)
		this.loadShopDetail()
		this.loadCategories()
		this.loadProducts()
	},
	methods: {
		async loadShopDetail() {
			const res = await shopApi.getShopDetail(this.shopId)
			if (res.code === 0) {
				this.shop = res.data
			}
		},
		async loadCategories() {
			const res = await productApi.getCategories()
			if (res.code === 0) {
				this.categories = res.data
			}
		},
		async loadProducts() {
			const res = await productApi.getProductList({ 
				shopId: this.shopId, 
				categoryId: this.currentCategory 
			})
			if (res.code === 0) {
				this.productList = res.data
			}
		},
		selectCategory(id) {
			this.currentCategory = id
			this.loadProducts()
		},
		goProductDetail(id) {
			uni.navigateTo({ url: '/pages/product/detail?id=' + id })
		},
		async addToCart(product) {
			await cartApi.addToCart(product, 1, product.specs[0])
			store.addToCart(product, 1, product.specs[0])
			uni.showToast({ title: '已加入购物车', icon: 'success' })
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
	padding-bottom: 120rpx;
}

.shop-header {
	height: 300rpx;
	position: relative;
	overflow: hidden;
}

.shop-bg {
	width: 100%;
	height: 100%;
	position: absolute;
	filter: blur(20rpx);
	transform: scale(1.2);
}

.shop-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0,0.4);
}

.shop-info {
	position: absolute;
	bottom: 30rpx;
	left: 30rpx;
	right: 30rpx;
	display: flex;
	align-items: center;
}

.shop-logo {
	width: 120rpx;
	height: 120rpx;
	border-radius: 16rpx;
	border: 4rpx solid #fff;
	margin-right: 20rpx;
}

.shop-detail {
	flex: 1;
}

.shop-name {
	font-size: 36rpx;
	color: #fff;
	font-weight: bold;
	display: block;
	margin-bottom: 10rpx;
}

.shop-meta {
	display: flex;
	margin-bottom: 10rpx;
}

.shop-score {
	font-size: 26rpx;
	color: #ffc107;
	margin-right: 20rpx;
}

.shop-distance {
	font-size: 24rpx;
	color: rgba(255,255,255,0.8);
}

.shop-tags {
	display: flex;
}

.tag {
	font-size: 22rpx;
	color: #fff;
	background: rgba(255,255,255,0.2);
	padding: 4rpx 12rpx;
	border-radius: 6rpx;
	margin-right: 12rpx;
}

.main-content {
	display: flex;
	height: calc(100vh - 420rpx);
}

.category-list {
	width: 180rpx;
	background: #fff;
	height: 100%;
}

.category-item {
	padding: 30rpx 20rpx;
	font-size: 26rpx;
	color: #666;
	text-align: center;
	border-left: 4rpx solid transparent;
}

.category-item.active {
	background: #f5f5f5;
	color: #4CD964;
	border-left-color: #4CD964;
	font-weight: bold;
}

.product-list {
	flex: 1;
	padding: 20rpx;
	height: 100%;
}

.product-item {
	display: flex;
	background: #fff;
	border-radius: 12rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	position: relative;
}

.product-img {
	width: 160rpx;
	height: 160rpx;
	border-radius: 12rpx;
	margin-right: 20rpx;
}

.product-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.product-name {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

.product-desc {
	font-size: 24rpx;
	color: #999;
	margin-top: 8rpx;
	flex: 1;
}

.product-bottom {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.price-row {
	display: flex;
	align-items: baseline;
}

.price {
	font-size: 32rpx;
	color: #ff6b00;
	font-weight: bold;
}

.original-price {
	font-size: 24rpx;
	color: #999;
	text-decoration: line-through;
	margin-left: 10rpx;
}

.add-btn {
	width: 50rpx;
	height: 50rpx;
	background: linear-gradient(135deg, #4CD964 0%, #5AC8FA 100%);
	color: #fff;
	font-size: 36rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
}

.special-tag {
	position: absolute;
	top: 0;
	right: 0;
	background: #FF3B30;
	color: #fff;
	font-size: 20rpx;
	padding: 4rpx 12rpx;
	border-radius: 0 12rpx 0 12rpx;
}

.cart-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 100rpx;
	background: #2c2c2c;
	display: flex;
	align-items: center;
	padding: 0 24rpx;
	padding-bottom: env(safe-area-inset-bottom);
}

.cart-icon-wrap {
	position: relative;
	margin-right: 20rpx;
}

.cart-icon {
	font-size: 48rpx;
}

.cart-badge {
	position: absolute;
	top: -10rpx;
	right: -10rpx;
	background: #FF3B30;
	color: #fff;
	font-size: 20rpx;
	min-width: 32rpx;
	height: 32rpx;
	line-height: 32rpx;
	text-align: center;
	border-radius: 16rpx;
}

.cart-info {
	flex: 1;
}

.cart-total {
	font-size: 36rpx;
	color: #fff;
	font-weight: bold;
	display: block;
}

.cart-min {
	font-size: 22rpx;
	color: rgba(255,255,255,0.6);
}

.checkout-btn {
	padding: 20rpx 40rpx;
	background: linear-gradient(135deg, #4CD964 0%, #5AC8FA 100%);
	color: #fff;
	font-size: 28rpx;
	border-radius: 40rpx;
}

.checkout-btn.disabled {
	background: #666;
}
</style>
