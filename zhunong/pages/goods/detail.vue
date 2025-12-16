<template>
	<view class="container">
		<!-- 商品图片 -->
		<swiper class="goods-swiper" indicator-dots>
			<swiper-item>
				<image :src="goods.image" mode="aspectFill" class="goods-img"></image>
			</swiper-item>
		</swiper>
		
		<!-- 价格信息 -->
		<view class="price-area">
			<view class="price-row">
				<text class="price">¥{{goods.price}}</text>
				<text class="original-price">¥{{goods.originalPrice}}</text>
				<view class="special-tag" v-if="goods.isSpecial">特价</view>
			</view>
			<text class="sales">已售{{goods.sales}}件</text>
		</view>
		
		<!-- 商品信息 -->
		<view class="goods-info">
			<text class="goods-name">{{goods.name}}</text>
			<view class="shop-row" @click="goShop">
				<text class="shop-name">{{goods.shopName}}</text>
				<text class="shop-arrow">进店 ></text>
			</view>
		</view>
		
		<!-- 规格选择 -->
		<view class="spec-area">
			<view class="spec-header">
				<text class="spec-title">规格</text>
				<text class="spec-selected">已选：{{selectedSpec || '默认规格'}} x {{count}}</text>
			</view>
			<view class="spec-list">
				<view 
					class="spec-item" 
					:class="{active: selectedSpec === item}"
					v-for="item in specs" 
					:key="item"
					@click="selectedSpec = item"
				>
					{{item}}
				</view>
			</view>
			<view class="count-row">
				<text>数量</text>
				<view class="count-box">
					<view class="count-btn" @click="count > 1 && count--">-</view>
					<text class="count-num">{{count}}</text>
					<view class="count-btn" @click="count++">+</view>
				</view>
			</view>
		</view>
		
		<!-- 商品详情 -->
		<view class="detail-area">
			<view class="detail-header">
				<text class="detail-title">商品详情</text>
			</view>
			<view class="detail-content">
				<text>商品名称：{{goods.name}}</text>
				<text>商品产地：优质产区</text>
				<text>保质期：请参考包装</text>
				<text>储存方式：阴凉干燥处保存</text>
			</view>
		</view>
		
		<!-- 底部操作栏 -->
		<view class="bottom-bar">
			<view class="bar-item" @click="goShop">
				<text class="bar-icon">🏪</text>
				<text class="bar-text">店铺</text>
			</view>
			<view class="bar-item" @click="goCart">
				<text class="bar-icon">🛒</text>
				<text class="bar-text">购物车</text>
				<view class="cart-badge" v-if="cartCount">{{cartCount}}</view>
			</view>
			<button class="add-cart-btn" @click="addToCart">加入购物车</button>
			<button class="buy-btn" @click="buyNow">立即购买</button>
		</view>
	</view>
</template>

<script>
import api from '@/api/index.js'

export default {
	data() {
		return {
			goodsId: '',
			goods: {},
			specs: ['默认规格', '大份', '小份'],
			selectedSpec: '默认规格',
			count: 1,
			cartCount: 0
		}
	},
	onLoad(options) {
		this.goodsId = options.id
		this.loadGoods()
		this.loadCartCount()
	},
	methods: {
		async loadGoods() {
			const res = await api.getGoodsDetail(this.goodsId)
			this.goods = res.data
		},
		async loadCartCount() {
			const res = await api.getCart()
			this.cartCount = res.data.reduce((sum, item) => sum + item.count, 0)
		},
		goShop() {
			uni.navigateTo({ url: '/pages/shop/detail?id=' + this.goods.shopId })
		},
		goCart() {
			uni.switchTab({ url: '/pages/cart/cart' })
		},
		async addToCart() {
			await api.addToCart({
				goodsId: this.goods.id,
				spec: this.selectedSpec,
				count: this.count
			})
			this.cartCount += this.count
			uni.showToast({ title: '已加入购物车', icon: 'success' })
		},
		buyNow() {
			const orderGoods = [{
				goodsId: this.goods.id,
				name: this.goods.name,
				image: this.goods.image,
				price: this.goods.price,
				spec: this.selectedSpec,
				count: this.count,
				shopId: this.goods.shopId,
				shopName: this.goods.shopName
			}]
			uni.setStorageSync('orderGoods', orderGoods)
			uni.navigateTo({ url: '/pages/order/confirm' })
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: #f5f5f5;
	padding-bottom: 160rpx;
}
.goods-swiper {
	height: 650rpx;
}
.goods-img {
	width: 100%;
	height: 100%;
}
.price-area {
	background: #fff;
	padding: 28rpx;
	position: relative;
}
.price-area::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 4rpx;
	background: #111;
}
.price-row {
	display: flex;
	align-items: baseline;
}
.price {
	font-size: 56rpx;
	color: #FF4444;
	font-weight: bold;
}
.original-price {
	font-size: 28rpx;
	color: #bbb;
	text-decoration: line-through;
	margin-left: 16rpx;
}
.special-tag {
	background: linear-gradient(135deg, #FF4444, #FF6B35);
	color: #fff;
	font-size: 24rpx;
	padding: 6rpx 16rpx;
	border-radius: 8rpx;
	margin-left: 16rpx;
	font-weight: 500;
}
.sales {
	font-size: 26rpx;
	color: #999;
	margin-top: 14rpx;
	display: block;
}
.goods-info {
	background: #fff;
	padding: 28rpx;
	margin-top: 20rpx;
	border-radius: 20rpx 20rpx 0 0;
}
.goods-name {
	font-size: 34rpx;
	color: #333;
	font-weight: bold;
	line-height: 1.5;
}
.shop-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 24rpx;
	padding-top: 24rpx;
	border-top: 1rpx solid #f0f0f0;
}
.shop-name {
	font-size: 28rpx;
	color: #666;
}
.shop-arrow {
	font-size: 26rpx;
	color: #111;
	padding: 8rpx 20rpx;
	background: #f3f3f3;
	border-radius: 20rpx;
}
.spec-area {
	background: #fff;
	padding: 24rpx;
	margin-top: 20rpx;
}
.spec-header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 20rpx;
}
.spec-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}
.spec-selected {
	font-size: 26rpx;
	color: #999;
}
.spec-list {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
	margin-bottom: 24rpx;
}
.spec-item {
	padding: 12rpx 24rpx;
	background: #f5f5f5;
	border-radius: 8rpx;
	font-size: 26rpx;
	color: #666;
	border: 2rpx solid transparent;
}
.spec-item.active {
	background: #111;
	color: #fff;
	border-color: #111;
}
.count-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 24rpx;
	border-top: 1rpx solid #f5f5f5;
}
.count-box {
	display: flex;
	align-items: center;
}
.count-btn {
	width: 56rpx;
	height: 56rpx;
	background: #f5f5f5;
	border-radius: 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
}
.count-num {
	width: 80rpx;
	text-align: center;
	font-size: 30rpx;
}
.detail-area {
	background: #fff;
	margin-top: 20rpx;
	padding: 24rpx;
}
.detail-header {
	margin-bottom: 20rpx;
}
.detail-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}
.detail-content text {
	display: block;
	font-size: 26rpx;
	color: #666;
	line-height: 2;
}
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 120rpx;
	background: #fff;
	display: flex;
	align-items: center;
	padding: 0 24rpx;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	box-shadow: 0 -4rpx 24rpx rgba(0,0,0,0.1);
}
.bar-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 28rpx;
	position: relative;
}
.bar-icon {
	font-size: 44rpx;
}
.bar-text {
	font-size: 22rpx;
	color: #666;
	margin-top: 4rpx;
}
.cart-badge {
	position: absolute;
	top: -8rpx;
	right: 12rpx;
	background: #111;
	color: #fff;
	font-size: 20rpx;
	padding: 4rpx 12rpx;
	border-radius: 20rpx;
	font-weight: bold;
}
.add-cart-btn {
	flex: 1;
	height: 80rpx;
	line-height: 80rpx;
	background: #f3f3f3;
	color: #111;
	border-radius: 40rpx 0 0 40rpx;
	font-size: 30rpx;
	margin-left: 24rpx;
	font-weight: 500;
}
.buy-btn {
	flex: 1;
	height: 80rpx;
	line-height: 80rpx;
	background: #111;
	color: #fff;
	border-radius: 0 40rpx 40rpx 0;
	font-size: 30rpx;
	font-weight: 500;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.18);
}
</style>
