<template>
	<view class="container">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<view class="search-box">
				<text>🔍</text>
				<input type="text" v-model="keyword" placeholder="搜索商品" @confirm="search" />
			</view>
		</view>
		
		<!-- 筛选栏 -->
		<view class="filter-bar">
			<view class="filter-item" :class="{active: sortType === 'default'}" @click="sortType = 'default'">
				<text>综合</text>
			</view>
			<view class="filter-item" :class="{active: sortType === 'sales'}" @click="sortType = 'sales'">
				<text>销量</text>
			</view>
			<view class="filter-item" :class="{active: sortType === 'price'}" @click="togglePriceSort">
				<text>价格</text>
				<text class="sort-icon">{{priceAsc ? '↑' : '↓'}}</text>
			</view>
		</view>
		
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="goods-item" v-for="item in goodsList" :key="item.id" @click="goDetail(item.id)">
				<image :src="item.image" mode="aspectFill" class="goods-img"></image>
				<view class="special-tag" v-if="item.isSpecial">特价</view>
				<view class="goods-info">
					<text class="goods-name">{{item.name}}</text>
					<text class="goods-shop">{{item.shopName}}</text>
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
		
		<view class="empty" v-if="!goodsList.length">
			<text>暂无商品</text>
		</view>
	</view>
</template>

<script>
import api from '@/api/index.js'

export default {
	data() {
		return {
			categoryId: '',
			keyword: '',
			sortType: 'default',
			priceAsc: true,
			goodsList: []
		}
	},
	onLoad(options) {
		this.categoryId = options.categoryId || ''
		this.keyword = options.keyword || ''
		this.loadGoods()
	},
	methods: {
		async loadGoods() {
			const res = await api.getGoodsList({
				categoryId: this.categoryId,
				keyword: this.keyword,
				sortType: this.sortType,
				priceAsc: this.priceAsc
			})
			this.goodsList = res.data
		},
		search() {
			this.loadGoods()
		},
		togglePriceSort() {
			if (this.sortType === 'price') {
				this.priceAsc = !this.priceAsc
			} else {
				this.sortType = 'price'
				this.priceAsc = true
			}
			this.loadGoods()
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
.search-bar {
	padding: 20rpx;
	background: #fff;
}
.search-box {
	display: flex;
	align-items: center;
	background: #f5f5f5;
	border-radius: 32rpx;
	padding: 16rpx 24rpx;
}
.search-box input {
	flex: 1;
	margin-left: 16rpx;
	font-size: 28rpx;
}
.filter-bar {
	display: flex;
	background: #fff;
	padding: 20rpx 0;
	border-top: 1rpx solid #f5f5f5;
}
.filter-item {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 28rpx;
	color: #666;
}
.filter-item.active {
	color: #111;
}
.sort-icon {
	margin-left: 8rpx;
}
.goods-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	padding: 20rpx;
}
.goods-item {
	width: 48%;
	background: #fff;
	border-radius: 12rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
	position: relative;
}
.goods-img {
	width: 100%;
	height: 280rpx;
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
.goods-shop {
	font-size: 22rpx;
	color: #999;
	margin-top: 8rpx;
	display: block;
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
	font-size: 30rpx;
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
.empty {
	text-align: center;
	padding: 100rpx 0;
	color: #999;
}
</style>
