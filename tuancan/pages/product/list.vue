<template>
	<view class="container">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<view class="search-input">
				<text class="search-icon">🔍</text>
				<input class="input" v-model="keyword" placeholder="搜索商品" @confirm="search" />
			</view>
		</view>
		
		<!-- 分类tabs -->
		<scroll-view class="category-scroll" scroll-x>
			<view class="category-list">
				<view 
					class="category-item" 
					:class="{active: currentCategory === item.id}" 
					v-for="item in categories" 
					:key="item.id"
					@click="selectCategory(item.id)">
					{{item.name}}
				</view>
			</view>
		</scroll-view>
		
		<!-- 商品列表 -->
		<scroll-view class="product-list" scroll-y>
			<view class="empty" v-if="productList.length === 0">
				<text class="empty-text">暂无商品</text>
			</view>
			<view class="product-grid">
				<view class="product-item" v-for="product in productList" :key="product.id" @click="goDetail(product.id)">
					<image class="product-img" :src="product.image" mode="aspectFill"></image>
					<view class="special-tag" v-if="product.isSpecial">特价</view>
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
			keyword: '',
			categories: [],
			currentCategory: 1,
			productList: []
		}
	},
	onLoad() {
		this.loadCategories()
		this.loadProducts()
	},
	methods: {
		async loadCategories() {
			const res = await productApi.getCategories()
			if (res.code === 0) {
				this.categories = res.data
			}
		},
		async loadProducts() {
			const res = await productApi.getProductList({ 
				categoryId: this.currentCategory,
				keyword: this.keyword
			})
			if (res.code === 0) {
				this.productList = res.data
			}
		},
		selectCategory(id) {
			this.currentCategory = id
			this.loadProducts()
		},
		search() {
			this.loadProducts()
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

.category-scroll {
	background: #fff;
	white-space: nowrap;
	border-top: 1rpx solid #f0f0f0;
}

.category-list {
	display: inline-flex;
	padding: 20rpx;
}

.category-item {
	padding: 16rpx 32rpx;
	font-size: 28rpx;
	color: #666;
	background: #f5f5f5;
	border-radius: 30rpx;
	margin-right: 20rpx;
}

.category-item.active {
	color: #fff;
	background: linear-gradient(135deg, #4CD964 0%, #5AC8FA 100%);
}

.product-list {
	padding: 20rpx;
	height: calc(100vh - 220rpx);
}

.empty {
	text-align: center;
	padding: 100rpx 0;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}

.product-grid {
	display: flex;
	flex-wrap: wrap;
	margin: 0 -10rpx;
}

.product-item {
	width: calc(50% - 20rpx);
	margin: 10rpx;
	background: #fff;
	border-radius: 16rpx;
	overflow: hidden;
	position: relative;
}

.product-img {
	width: 100%;
	height: 300rpx;
}

.special-tag {
	position: absolute;
	top: 16rpx;
	left: 0;
	background: #FF3B30;
	color: #fff;
	font-size: 22rpx;
	padding: 6rpx 16rpx;
	border-radius: 0 16rpx 16rpx 0;
}

.product-info {
	padding: 16rpx;
}

.product-name {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.product-desc {
	font-size: 24rpx;
	color: #999;
	display: block;
	margin-top: 8rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.product-bottom {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 16rpx;
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
	font-size: 22rpx;
	color: #999;
	text-decoration: line-through;
	margin-left: 8rpx;
}

.add-btn {
	width: 48rpx;
	height: 48rpx;
	background: linear-gradient(135deg, #4CD964 0%, #5AC8FA 100%);
	color: #fff;
	font-size: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
}
</style>
