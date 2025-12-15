<template>
	<view class="container">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<view class="search-input">
				<text class="search-icon">🔍</text>
				<input class="input" v-model="keyword" placeholder="搜索商家" @confirm="search" />
			</view>
		</view>
		
		<!-- 筛选栏 -->
		<view class="filter-bar">
			<view class="filter-item" :class="{active: sortType === 'default'}" @click="setSort('default')">综合</view>
			<view class="filter-item" :class="{active: sortType === 'distance'}" @click="setSort('distance')">距离</view>
			<view class="filter-item" :class="{active: sortType === 'score'}" @click="setSort('score')">评分</view>
		</view>
		
		<!-- 商家列表 -->
		<scroll-view class="shop-list" scroll-y>
			<view class="empty" v-if="shopList.length === 0">
				<text class="empty-text">暂无商家</text>
			</view>
			<view class="shop-item" v-for="shop in shopList" :key="shop.id" @click="goShopDetail(shop.id)">
				<image class="shop-logo" :src="shop.logo" mode="aspectFill"></image>
				<view class="shop-info">
					<text class="shop-name">{{shop.name}}</text>
					<view class="shop-meta">
						<text class="shop-score">⭐ {{shop.score}}</text>
						<text class="shop-distance">{{shop.distance}}</text>
					</view>
					<view class="shop-tags">
						<text class="tag" v-for="tag in shop.tags" :key="tag">{{tag}}</text>
					</view>
					<text class="shop-min">¥{{shop.minPrice}}起送</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { shopApi } from '@/api/mock.js'

export default {
	data() {
		return {
			keyword: '',
			sortType: 'default',
			shopList: []
		}
	},
	onLoad() {
		this.loadShops()
	},
	methods: {
		async loadShops() {
			uni.showLoading({ title: '加载中...' })
			const res = await shopApi.getShopList({ keyword: this.keyword, sort: this.sortType })
			uni.hideLoading()
			if (res.code === 0) {
				this.shopList = res.data
			}
		},
		setSort(type) {
			this.sortType = type
			this.loadShops()
		},
		search() {
			this.loadShops()
		},
		goShopDetail(id) {
			uni.navigateTo({ url: '/pages/shop/detail?id=' + id })
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: #f5f5f5;
}

.search-bar {
	padding: 20rpx;
	background: #fff;
}

.search-input {
	display: flex;
	align-items: center;
	background: #f5f5f5;
	border-radius: 40rpx;
	padding: 0 30rpx;
}

.search-icon {
	font-size: 32rpx;
	margin-right: 16rpx;
}

.input {
	flex: 1;
	height: 80rpx;
	font-size: 28rpx;
}

.filter-bar {
	display: flex;
	background: #fff;
	padding: 20rpx 0;
	border-top: 1rpx solid #f0f0f0;
	position: sticky;
	top: 0;
	z-index: 10;
}

.filter-item {
	flex: 1;
	text-align: center;
	font-size: 28rpx;
	color: #666;
	position: relative;
}

.filter-item.active {
	color: #4CD964;
	font-weight: bold;
}

.shop-list {
	padding: 20rpx;
	height: calc(100vh - 200rpx);
}

.empty {
	text-align: center;
	padding: 100rpx 0;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}

.shop-item {
	display: flex;
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
}

.shop-logo {
	width: 140rpx;
	height: 140rpx;
	border-radius: 12rpx;
	margin-right: 20rpx;
}

.shop-info {
	flex: 1;
}

.shop-name {
	font-size: 32rpx;
	color: #333;
	font-weight: bold;
	display: block;
	margin-bottom: 10rpx;
}

.shop-meta {
	display: flex;
	align-items: center;
	margin-bottom: 12rpx;
}

.shop-score {
	font-size: 26rpx;
	color: #ff9500;
	margin-right: 20rpx;
}

.shop-distance {
	font-size: 24rpx;
	color: #999;
}

.shop-tags {
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 10rpx;
}

.tag {
	font-size: 22rpx;
	color: #4CD964;
	background: rgba(76, 217, 100, 0.1);
	padding: 4rpx 12rpx;
	border-radius: 6rpx;
	margin-right: 12rpx;
}

.shop-min {
	font-size: 24rpx;
	color: #999;
}
</style>
