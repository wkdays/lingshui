<template>
	<view class="container">
		<!-- 顶部banner -->
		<view class="special-banner">
			<text class="banner-title">🏷️ 特价专区</text>
			<text class="banner-desc">精选特惠，限时抢购</text>
		</view>
		
		<!-- 商品列表 -->
		<scroll-view class="product-list" scroll-y>
			<view class="empty" v-if="productList.length === 0">
				<text class="empty-text">暂无特价商品</text>
			</view>
			<view class="product-item" v-for="product in productList" :key="product.id" @click="goDetail(product.id)">
				<image class="product-img" :src="product.image" mode="aspectFill"></image>
				<view class="discount-tag">
					{{getDiscount(product)}}折
				</view>
				<view class="product-info">
					<text class="product-name">{{product.name}}</text>
					<text class="product-desc">{{product.description}}</text>
					<view class="product-bottom">
						<view class="price-row">
							<text class="price">¥{{product.price}}</text>
							<text class="original-price">¥{{product.originalPrice}}</text>
						</view>
						<view class="save-tag">省¥{{(product.originalPrice - product.price).toFixed(2)}}</view>
					</view>
					<view class="progress-row">
						<view class="progress-bar">
							<view class="progress-inner" :style="{width: getSoldPercent(product) + '%'}"></view>
						</view>
						<text class="sold-text">已售{{product.sales}}份</text>
					</view>
					<view class="buy-btn" @click.stop="addToCart(product)">立即抢购</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { productApi, cartApi } from '@/api/mock.js'
import store from '@/store/index.js'

export default {
	data() {
		return {
			productList: []
		}
	},
	onLoad() {
		this.loadProducts()
	},
	methods: {
		async loadProducts() {
			uni.showLoading({ title: '加载中...' })
			const res = await productApi.getSpecialProducts()
			uni.hideLoading()
			if (res.code === 0) {
				this.productList = res.data
			}
		},
		getDiscount(product) {
			return ((product.price / product.originalPrice) * 10).toFixed(1)
		},
		getSoldPercent(product) {
			return Math.min((product.sales / (product.sales + product.stock)) * 100, 100)
		},
		goDetail(id) {
			uni.navigateTo({ url: '/pages/product/detail?id=' + id })
		},
		async addToCart(product) {
			await cartApi.addToCart(product, 1, product.specs[0])
			store.addToCart(product, 1, product.specs[0])
			uni.showToast({ title: '已加入购物车', icon: 'success' })
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: #f5f5f5;
}

.special-banner {
	background: linear-gradient(135deg, #FF3B30 0%, #FF9500 100%);
	padding: 50rpx 30rpx;
	text-align: center;
}

.banner-title {
	font-size: 44rpx;
	color: #fff;
	font-weight: bold;
	display: block;
	margin-bottom: 12rpx;
}

.banner-desc {
	font-size: 28rpx;
	color: rgba(255,255,255,0.9);
}

.product-list {
	padding: 20rpx;
	height: calc(100vh - 180rpx);
}

.empty {
	text-align: center;
	padding: 100rpx 0;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}

.product-item {
	display: flex;
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
	position: relative;
}

.product-img {
	width: 200rpx;
	height: 200rpx;
	border-radius: 12rpx;
	margin-right: 20rpx;
}

.discount-tag {
	position: absolute;
	top: 24rpx;
	left: 24rpx;
	background: #FF3B30;
	color: #fff;
	font-size: 22rpx;
	font-weight: bold;
	padding: 6rpx 12rpx;
	border-radius: 8rpx;
}

.product-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.product-name {
	font-size: 30rpx;
	color: #333;
	font-weight: bold;
	display: block;
	margin-bottom: 8rpx;
}

.product-desc {
	font-size: 24rpx;
	color: #999;
	display: block;
	margin-bottom: 12rpx;
}

.product-bottom {
	display: flex;
	align-items: center;
	margin-bottom: 12rpx;
}

.price-row {
	display: flex;
	align-items: baseline;
}

.price {
	font-size: 36rpx;
	color: #FF3B30;
	font-weight: bold;
}

.original-price {
	font-size: 24rpx;
	color: #999;
	text-decoration: line-through;
	margin-left: 12rpx;
}

.save-tag {
	margin-left: 16rpx;
	font-size: 22rpx;
	color: #FF3B30;
	background: rgba(255, 59, 48, 0.1);
	padding: 4rpx 12rpx;
	border-radius: 6rpx;
}

.progress-row {
	display: flex;
	align-items: center;
	margin-bottom: 16rpx;
}

.progress-bar {
	flex: 1;
	height: 12rpx;
	background: #f0f0f0;
	border-radius: 6rpx;
	overflow: hidden;
	margin-right: 16rpx;
}

.progress-inner {
	height: 100%;
	background: linear-gradient(135deg, #FF3B30 0%, #FF9500 100%);
	border-radius: 6rpx;
}

.sold-text {
	font-size: 22rpx;
	color: #999;
	white-space: nowrap;
}

.buy-btn {
	align-self: flex-start;
	padding: 12rpx 40rpx;
	background: linear-gradient(135deg, #FF3B30 0%, #FF9500 100%);
	color: #fff;
	font-size: 26rpx;
	border-radius: 30rpx;
}
</style>
