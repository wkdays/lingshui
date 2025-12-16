<template>
	<view class="container">
		<!-- 顶部：门店 + 配送方式 -->
		<view class="top-card">
			<view class="shop-bar" @click="goShopList">
				<text class="shop-name">{{currentShop.name}}</text>
				<text class="shop-tip">选择门店</text>
				<text class="shop-arrow">›</text>
			</view>
			<view class="delivery-tabs">
				<view class="delivery-tab" :class="{active: deliveryType === 1}" @click="setDeliveryType(1)">自提</view>
				<view class="delivery-tab" :class="{active: deliveryType === 2}" @click="setDeliveryType(2)">驿站</view>
				<view class="delivery-tab" :class="{active: deliveryType === 3}" @click="setDeliveryType(3)">上门</view>
			</view>
		</view>

		<view class="main">
			<!-- 左侧分类 -->
			<scroll-view class="sidebar" scroll-y>
				<view
					class="sidebar-item"
					:class="{active: currentIndex === index}"
					v-for="(item, index) in categories"
					:key="item.id"
					@click="switchCategory(index)"
				>
					<text class="sidebar-text">{{item.name}}</text>
				</view>
			</scroll-view>

			<!-- 右侧商品列表 -->
			<scroll-view class="content" scroll-y>
				<view class="goods-list">
					<view class="goods-item" v-for="item in goodsList" :key="item.id" @click="goDetail(item.id)">
						<image :src="item.image" mode="aspectFill" class="goods-img"></image>
						<view class="goods-info">
							<view class="goods-title-row">
								<text class="goods-name">{{item.name}}</text>
								<text class="goods-tag" v-if="item.isSpecial">特价</text>
							</view>
							<text class="goods-desc ellipsis">精选好物 · 新鲜直达</text>
							<view class="goods-bottom">
								<text class="goods-price">￥{{item.price}}</text>
								<view class="add-btn" @click.stop="addCart(item)">+</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 自定义tabbar -->
		<custom-tabbar :current="1"></custom-tabbar>
	</view>
</template>

<script>
import api from '@/api/index.js'
import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue'

export default {
	components: { CustomTabbar },
	data() {
		return {
			categories: [],
			currentIndex: 0,
			goodsList: [],
			shops: [],
			currentShop: { id: 0, name: '请选择门店' },
			deliveryType: 3
		}
	},
	onLoad() {
		this.deliveryType = Number(uni.getStorageSync('tg_default_delivery_type')) || 3
		this.loadInit()
	},
	onShow() {
		const type = Number(uni.getStorageSync('tg_default_delivery_type')) || 3
		this.deliveryType = type

		const shopId = Number(uni.getStorageSync('tg_selected_shop_id')) || 0
		if (shopId && this.currentShop.id !== shopId) {
			const next = this.shops.find(s => s.id === shopId)
			if (next) {
				this.currentShop = next
				this.loadGoods()
			}
		}
	},
	methods: {
		async loadInit() {
			const [catesRes, shopsRes] = await Promise.all([api.getCategories(), api.getShops()])
			this.categories = catesRes.data || []
			this.shops = shopsRes.data || []

			const savedShopId = Number(uni.getStorageSync('tg_selected_shop_id')) || 0
			this.currentShop = this.shops.find(s => s.id === savedShopId) || this.shops[0] || this.currentShop
			if (this.currentShop?.id) uni.setStorageSync('tg_selected_shop_id', this.currentShop.id)

			await this.loadGoods()
		},
		async loadGoods() {
			const categoryId = this.categories[this.currentIndex]?.id
			const res = await api.getGoodsList({ categoryId, shopId: this.currentShop.id })
			this.goodsList = res.data || []
		},
		switchCategory(index) {
			this.currentIndex = index
			this.loadGoods()
		},
		setDeliveryType(type) {
			this.deliveryType = type
			uni.setStorageSync('tg_default_delivery_type', type)
			uni.showToast({ title: `已切换：${type === 1 ? '自提' : type === 2 ? '驿站' : '上门'}`, icon: 'none' })
		},
		goShopList() {
			uni.navigateTo({ url: '/pages/shop/list?select=1' })
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
	height: 100vh;
	background: #f5f5f5;
	padding-bottom: 112rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}
.top-card {
	background: #fff;
	padding: 16rpx 20rpx 18rpx;
	box-shadow: 0 6rpx 18rpx rgba(0,0,0,0.04);
}
.shop-bar {
	display: flex;
	align-items: baseline;
	padding: 14rpx 8rpx;
}
.shop-name {
	font-size: 32rpx;
	font-weight: 800;
	color: #111;
}
.shop-tip {
	margin-left: 14rpx;
	font-size: 24rpx;
	color: #999;
}
.shop-arrow {
	margin-left: auto;
	font-size: 28rpx;
	color: #bbb;
}
.delivery-tabs {
	display: flex;
	gap: 12rpx;
	padding: 6rpx 8rpx 10rpx;
}
.delivery-tab {
	flex: 1;
	height: 64rpx;
	line-height: 64rpx;
	text-align: center;
	border-radius: 14rpx;
	background: #f3f3f3;
	color: #666;
	font-size: 26rpx;
	font-weight: 600;
}
.delivery-tab.active {
	background: #111;
	color: #fff;
}
.main {
	display: flex;
	flex: 1;
	min-height: 0;
}
.sidebar {
	width: 210rpx;
	background: #fff;
	border-right: 1rpx solid rgba(0,0,0,0.06);
	height: 100%;
}
.sidebar-item {
	padding: 30rpx 16rpx;
	display: flex;
	justify-content: center;
}
.sidebar-text {
	font-size: 26rpx;
	color: #666;
	font-weight: 600;
}
.sidebar-item.active {
	background: #f5f5f5;
}
.sidebar-item.active .sidebar-text {
	color: #111;
	font-weight: 800;
}
.content {
	flex: 1;
	background: #f5f5f5;
	padding: 16rpx;
	height: 100%;
}
.goods-item {
	display: flex;
	background: #fff;
	border-radius: 16rpx;
	padding: 16rpx;
	margin-bottom: 14rpx;
}
.goods-img {
	width: 150rpx;
	height: 150rpx;
	border-radius: 14rpx;
	background: #eee;
}
.goods-info {
	flex: 1;
	margin-left: 16rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.goods-title-row {
	display: flex;
	align-items: center;
	gap: 12rpx;
}
.goods-name {
	font-size: 28rpx;
	font-weight: 800;
	color: #111;
	flex: 1;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
.goods-tag {
	font-size: 22rpx;
	color: #111;
	background: #f3f3f3;
	padding: 6rpx 10rpx;
	border-radius: 10rpx;
	white-space: nowrap;
}
.goods-desc {
	font-size: 24rpx;
	color: #999;
	margin-top: 6rpx;
}
.goods-bottom {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.goods-price {
	font-size: 30rpx;
	color: #111;
	font-weight: 800;
}
.add-btn {
	width: 54rpx;
	height: 54rpx;
	border-radius: 27rpx;
	background: #111;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
}
</style>
