<template>
	<view class="container">
		<!-- 筛选栏 -->
		<view class="filter-bar">
			<view class="filter-item" :class="{active: sortType === 'default'}" @click="sortType = 'default'">
				<text>综合</text>
			</view>
			<view class="filter-item" :class="{active: sortType === 'distance'}" @click="sortType = 'distance'">
				<text>距离</text>
			</view>
			<view class="filter-item" :class="{active: sortType === 'score'}" @click="sortType = 'score'">
				<text>评分</text>
			</view>
			<view class="filter-item" :class="{active: sortType === 'sales'}" @click="sortType = 'sales'">
				<text>销量</text>
			</view>
		</view>
		
		<!-- 商家列表 -->
		<view class="shop-list">
			<view class="shop-item" v-for="item in shopList" :key="item.id" @click="goDetail(item.id)">
				<image :src="item.logo" mode="aspectFill" class="shop-logo"></image>
				<view class="shop-info">
					<text class="shop-name">{{item.name}}</text>
					<view class="shop-meta">
						<text class="shop-score">⭐ {{item.score}}</text>
						<text class="shop-distance">{{item.distance}}</text>
						<text class="shop-sales">月售{{item.sales}}</text>
					</view>
					<view class="shop-tags">
						<text class="tag" v-for="tag in item.tags" :key="tag">{{tag}}</text>
					</view>
				</view>
				<text class="shop-arrow">></text>
			</view>
		</view>
	</view>
</template>

<script>
import api from '@/api/index.js'

export default {
	data() {
		return {
			isSelect: false,
			selectedShopId: 0,
			sortType: 'default',
			shopList: []
		}
	},
	onLoad(options) {
		// 选择门店模式：返回上一页并写入本地选择
		this.isSelect = options.select === '1'
		this.selectedShopId = Number(uni.getStorageSync('tg_selected_shop_id')) || 0
		this.loadShops()
	},
	methods: {
		async loadShops() {
			const res = await api.getShops({ sortType: this.sortType })
			this.shopList = res.data
		},
		goDetail(id) {
			if (this.isSelect) {
				uni.setStorageSync('tg_selected_shop_id', id)
				uni.navigateBack()
				return
			}
			uni.navigateTo({ url: '/pages/shop/detail?id=' + id })
		}
	},
	watch: {
		sortType() {
			this.loadShops()
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: #f5f5f5;
}
.filter-bar {
	display: flex;
	background: #fff;
	padding: 28rpx 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
	position: sticky;
	top: 0;
	z-index: 10;
}
.filter-item {
	flex: 1;
	text-align: center;
	font-size: 28rpx;
	color: #666;
	padding: 12rpx 0;
	position: relative;
	transition: all 0.2s;
}
.filter-item.active {
	color: #111;
	font-weight: bold;
}
.filter-item.active::after {
	content: '';
	position: absolute;
	bottom: -8rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 40rpx;
	height: 6rpx;
	background: #111;
	border-radius: 3rpx;
}
.shop-list {
	padding: 20rpx;
}
.shop-item {
	display: flex;
	align-items: center;
	background: #fff;
	padding: 28rpx;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
	transition: transform 0.2s;
}
.shop-item:active {
	transform: scale(0.99);
}
.shop-logo {
	width: 140rpx;
	height: 140rpx;
	border-radius: 16rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.08);
}
.shop-info {
	flex: 1;
	margin-left: 24rpx;
}
.shop-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}
.shop-meta {
	display: flex;
	align-items: center;
	margin-top: 14rpx;
	font-size: 24rpx;
	color: #999;
}
.shop-score {
	color: #FF9800;
	margin-right: 20rpx;
	font-weight: 500;
}
.shop-distance {
	margin-right: 20rpx;
	padding: 4rpx 12rpx;
	background: #f5f5f5;
	border-radius: 8rpx;
}
.shop-tags {
	display: flex;
	flex-wrap: wrap;
	margin-top: 14rpx;
	gap: 12rpx;
}
.tag {
	font-size: 22rpx;
	color: #111;
	background: #f3f3f3;
	padding: 6rpx 16rpx;
	border-radius: 8rpx;
	border: 1rpx solid rgba(0,0,0,0.06);
}
.shop-arrow {
	font-size: 28rpx;
	color: #ccc;
}
</style>
