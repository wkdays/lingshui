<template>
	<view class="container">
		<!-- 商家头部 -->
		<view class="shop-header">
			<image :src="shop.logo" mode="aspectFill" class="shop-logo"></image>
			<view class="shop-info">
				<text class="shop-name">{{shop.name}}</text>
				<view class="shop-meta">
					<text class="shop-score">⭐ {{shop.score}}</text>
					<text class="shop-distance">{{shop.distance}}</text>
					<text class="shop-sales">月售{{shop.sales}}</text>
				</view>
				<view class="shop-tags">
					<text class="tag" v-for="tag in shop.tags" :key="tag">{{tag}}</text>
				</view>
			</view>
		</view>
		
		<!-- 商品列表 -->
		<view class="section">
			<view class="section-header">
				<text class="section-title">店铺商品</text>
			</view>
			<view class="goods-list">
				<view class="goods-item" v-for="item in goodsList" :key="item.id" @click="goDetail(item.id)">
					<image :src="item.image" mode="aspectFill" class="goods-img"></image>
					<view class="special-tag" v-if="item.isSpecial">特价</view>
					<view class="goods-info">
						<text class="goods-name">{{item.name}}</text>
						<view class="goods-bottom">
							<view class="price-row">
								<text class="goods-price">¥{{item.price}}</text>
								<text class="goods-original">¥{{item.originalPrice}}</text>
							</view>
							<view class="add-btn" @click.stop="addCart(item)">+</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import api from '@/api/index.js'

export default {
	data() {
		return {
			shopId: '',
			shop: {},
			goodsList: []
		}
	},
	onLoad(options) {
		this.shopId = options.id
		this.loadShop()
		this.loadGoods()
	},
	methods: {
		async loadShop() {
			const res = await api.getShopDetail(this.shopId)
			this.shop = res.data
		},
		async loadGoods() {
			const res = await api.getGoodsList({ shopId: this.shopId })
			this.goodsList = res.data
		},
		goDetail(id) {
			uni.navigateTo({ url: '/pages/goods/detail?id=' + id })
		},
		async addCart(item) {
			await api.addToCart({ goodsId: item.id, count: 1 })
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
.shop-header {
	display: flex;
	background: #fff;
	padding: 30rpx;
}
.shop-logo {
	width: 140rpx;
	height: 140rpx;
	border-radius: 12rpx;
}
.shop-info {
	flex: 1;
	margin-left: 24rpx;
}
.shop-name {
	font-size: 34rpx;
	font-weight: bold;
	color: #333;
}
.shop-meta {
	display: flex;
	align-items: center;
	margin-top: 16rpx;
	font-size: 26rpx;
	color: #999;
}
.shop-score {
	color: #FF9800;
	margin-right: 24rpx;
}
.shop-distance {
	margin-right: 24rpx;
}
.shop-tags {
	display: flex;
	margin-top: 16rpx;
}
.tag {
	font-size: 22rpx;
	color: #111;
	background: #f3f3f3;
	padding: 6rpx 16rpx;
	border-radius: 4rpx;
	margin-right: 16rpx;
}
.section {
	margin-top: 20rpx;
	background: #fff;
	padding: 24rpx;
}
.section-header {
	margin-bottom: 20rpx;
}
.section-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
}
.goods-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}
.goods-item {
	width: 48%;
	background: #fff;
	border-radius: 12rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
	position: relative;
}
.goods-img {
	width: 100%;
	height: 240rpx;
}
.special-tag {
	position: absolute;
	top: 16rpx;
	left: 0;
	background: #FF4444;
	color: #fff;
	font-size: 22rpx;
	padding: 4rpx 16rpx;
	border-radius: 0 16rpx 16rpx 0;
}
.goods-info {
	padding: 16rpx;
}
.goods-name {
	font-size: 26rpx;
	color: #333;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
.goods-bottom {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 12rpx;
}
.price-row {
	display: flex;
	align-items: baseline;
}
.goods-price {
	font-size: 28rpx;
	color: #FF4444;
	font-weight: bold;
}
.goods-original {
	font-size: 20rpx;
	color: #999;
	text-decoration: line-through;
	margin-left: 8rpx;
}
.add-btn {
	width: 48rpx;
	height: 48rpx;
	background: #111;
	color: #fff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
}
</style>
