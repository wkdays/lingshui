<template>
	<view class="container">
		<!-- 头部 -->
		<view class="header">
			<text class="header-title">🔥 特价专区</text>
			<text class="header-desc">限时抢购 低至5折</text>
		</view>
		
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="goods-item" v-for="item in goodsList" :key="item.id" @click="goDetail(item.id)">
				<image :src="item.image" mode="aspectFill" class="goods-img"></image>
				<view class="special-tag">特价</view>
				<view class="goods-info">
					<text class="goods-name">{{item.name}}</text>
					<text class="goods-shop">{{item.shopName}}</text>
					<view class="goods-bottom">
						<view class="price-row">
							<text class="goods-price">¥{{item.price}}</text>
							<text class="goods-original">¥{{item.originalPrice}}</text>
						</view>
						<view class="discount">{{getDiscount(item)}}折</view>
					</view>
					<view class="progress-bar">
						<view class="progress" :style="{width: getProgress(item) + '%'}"></view>
					</view>
					<text class="sales-text">已售{{item.sales}}件</text>
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
			goodsList: []
		}
	},
	onLoad() {
		this.loadGoods()
	},
	methods: {
		async loadGoods() {
			const res = await api.getSpecialGoods()
			this.goodsList = res.data
		},
		getDiscount(item) {
			return (item.price / item.originalPrice * 10).toFixed(1)
		},
		getProgress(item) {
			return Math.min(item.sales / 20, 100)
		},
		goDetail(id) {
			uni.navigateTo({ url: '/pages/goods/detail?id=' + id })
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: linear-gradient(180deg, #FFF0F0 0%, #f5f5f5 300rpx);
}
.header {
	background: linear-gradient(135deg, #FF4444 0%, #FF6B35 60%, #FF8C5A 100%);
	padding: 50rpx 30rpx;
	text-align: center;
	position: relative;
	overflow: hidden;
}
.header::before {
	content: '';
	position: absolute;
	top: -80rpx;
	right: -80rpx;
	width: 250rpx;
	height: 250rpx;
	background: rgba(255,255,255,0.1);
	border-radius: 50%;
}
.header::after {
	content: '';
	position: absolute;
	bottom: -60rpx;
	left: -60rpx;
	width: 180rpx;
	height: 180rpx;
	background: rgba(255,255,255,0.08);
	border-radius: 50%;
}
.header-title {
	font-size: 48rpx;
	font-weight: bold;
	color: #fff;
	display: block;
	text-shadow: 0 4rpx 12rpx rgba(0,0,0,0.15);
	position: relative;
	z-index: 1;
}
.header-desc {
	font-size: 28rpx;
	color: rgba(255,255,255,0.95);
	margin-top: 16rpx;
	display: block;
	position: relative;
	z-index: 1;
}
.goods-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	padding: 24rpx;
}
.goods-item {
	width: 48%;
	background: #fff;
	border-radius: 16rpx;
	margin-bottom: 24rpx;
	overflow: hidden;
	position: relative;
	box-shadow: 0 4rpx 20rpx rgba(255,68,68,0.1);
	transition: transform 0.2s;
}
.goods-item:active {
	transform: scale(0.98);
}
.goods-img {
	width: 100%;
	height: 300rpx;
}
.special-tag {
	position: absolute;
	top: 16rpx;
	left: 0;
	background: linear-gradient(90deg, #FF4444, #FF6B35);
	color: #fff;
	font-size: 24rpx;
	padding: 8rpx 24rpx;
	border-radius: 0 20rpx 20rpx 0;
	font-weight: bold;
	box-shadow: 0 4rpx 12rpx rgba(255,68,68,0.3);
}
.goods-info {
	padding: 20rpx;
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
}
.goods-bottom {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 14rpx;
}
.price-row {
	display: flex;
	align-items: baseline;
}
.goods-price {
	font-size: 36rpx;
	color: #FF4444;
	font-weight: bold;
}
.goods-original {
	font-size: 22rpx;
	color: #bbb;
	text-decoration: line-through;
	margin-left: 10rpx;
}
.discount {
	background: linear-gradient(135deg, #FF4444, #FF6B35);
	color: #fff;
	font-size: 24rpx;
	padding: 6rpx 16rpx;
	border-radius: 8rpx;
	font-weight: bold;
}
.progress-bar {
	height: 16rpx;
	background: #FFE4E1;
	border-radius: 8rpx;
	margin-top: 18rpx;
	overflow: hidden;
}
.progress {
	height: 100%;
	background: linear-gradient(90deg, #FF4444, #FF6B35, #FF8C5A);
	border-radius: 8rpx;
	position: relative;
}
.progress::after {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
	animation: shimmer 2s infinite;
}
@keyframes shimmer {
	0% { transform: translateX(-100%); }
	100% { transform: translateX(100%); }
}
.sales-text {
	font-size: 24rpx;
	color: #FF4444;
	margin-top: 10rpx;
	display: block;
	font-weight: 500;
}
</style>
