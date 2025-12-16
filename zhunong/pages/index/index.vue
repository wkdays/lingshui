<template>
	<view class="container">
		<!-- 品牌区 -->
		<view class="brand">
			<image src="/static/logo.png" mode="aspectFit" class="brand-logo"></image>
			<text class="brand-name">社区团购</text>
		</view>

		<!-- 配送方式快捷入口 -->
		<view class="delivery-grid">
			<view class="delivery-item" @click="goOrderEntry(1)">
				<view class="delivery-icon">自提</view>
				<text class="delivery-text">到店取货</text>
			</view>
			<view class="delivery-item" @click="goOrderEntry(2)">
				<view class="delivery-icon">驿站</view>
				<text class="delivery-text">送到驿站</text>
			</view>
			<view class="delivery-item" @click="goOrderEntry(3)">
				<view class="delivery-icon">上门</view>
				<text class="delivery-text">送货上门</text>
			</view>
		</view>

		<!-- 欢迎卡片 -->
		<view class="welcome-card">
			<view class="welcome-left">
				<text class="welcome-title">Hi ~</text>
				<text class="welcome-sub">欢迎来到社区团购</text>
			</view>
			<button class="welcome-btn" @click="goLogin">加入会员</button>
		</view>

		<!-- 快捷功能 -->
		<view class="quick-grid">
			<view class="quick-item" @click="goBalance">
				<view class="quick-icon">充值</view>
				<text class="quick-text">充值</text>
			</view>
			<view class="quick-item" @click="goTransactions">
				<view class="quick-icon">明细</view>
				<text class="quick-text">交易明细</text>
			</view>
			<view class="quick-item" @click="goShopList">
				<view class="quick-icon">门店</view>
				<text class="quick-text">门店</text>
			</view>
		</view>

		<!-- 公告 -->
		<view class="notice-card" v-if="notices.length">
			<view class="notice-left">
				<text class="notice-badge">公告</text>
			</view>
			<swiper class="notice-swiper" vertical autoplay circular :interval="3000">
				<swiper-item v-for="item in notices" :key="item.id">
					<text class="notice-text">{{item.title}}</text>
				</swiper-item>
			</swiper>
			<text class="notice-more" @click="goNoticeList">更多</text>
		</view>

		<!-- 轮播图 -->
		<swiper
			v-if="banners.length"
			class="banner"
			indicator-dots
			indicator-color="rgba(0,0,0,0.15)"
			indicator-active-color="rgba(0,0,0,0.45)"
			autoplay
			circular
			:interval="3000"
		>
			<swiper-item v-for="item in banners" :key="item.id">
				<image :src="item.image" mode="aspectFill" class="banner-img"></image>
			</swiper-item>
		</swiper>

		<!-- 门店推荐（假数据） -->
		<view class="section" v-if="shops.length">
			<view class="section-header">
				<text class="section-title">门店推荐</text>
				<text class="section-more" @click="goShopList">全部</text>
			</view>
			<scroll-view class="shop-scroll" scroll-x>
				<view class="shop-item" v-for="item in shops" :key="item.id" @click="goShopDetail(item.id)">
					<image :src="item.logo" mode="aspectFill" class="shop-logo"></image>
					<text class="shop-name">{{item.name}}</text>
					<text class="shop-meta">{{item.distance}} · {{item.score}}分</text>
				</view>
			</scroll-view>
		</view>

		<!-- 热门推荐（假数据） -->
		<view class="section" v-if="recommendGoods.length">
			<view class="section-header">
				<text class="section-title">热门推荐</text>
				<text class="section-more" @click="goGoodsList">更多</text>
			</view>
			<view class="goods-list">
				<view class="goods-item" v-for="item in recommendGoods" :key="item.id" @click="goGoodsDetail(item.id)">
					<image :src="item.image" mode="aspectFill" class="goods-img"></image>
					<view class="goods-info">
						<text class="goods-name">{{item.name}}</text>
						<view class="goods-bottom">
							<text class="goods-price">￥{{item.price}}</text>
							<view class="add-btn" @click.stop="addToCart(item)">+</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 自定义tabbar -->
		<custom-tabbar :current="0"></custom-tabbar>
	</view>
</template>

<script>
import api from '@/api/index.js'
import storage from '@/utils/storage.js'
import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue'

export default {
	components: { CustomTabbar },
	data() {
		return {
			banners: [],
			notices: [],
			shops: [],
			recommendGoods: []
		}
	},
	onLoad() {
		this.loadData()
	},
	onPullDownRefresh() {
		this.loadData().then(() => uni.stopPullDownRefresh())
	},
	methods: {
		async loadData() {
			const [bannersRes, noticesRes, shopsRes, goodsRes] = await Promise.all([
				api.getBanners(),
				api.getNotices(),
				api.getShops(),
				api.getRecommendGoods()
			])
			this.banners = bannersRes.data || []
			this.notices = noticesRes.data || []
			this.shops = shopsRes.data || []
			this.recommendGoods = goodsRes.data || []
		},
		goOrderEntry(deliveryType) {
			uni.setStorageSync('tg_default_delivery_type', deliveryType)
			uni.switchTab({ url: '/pages/category/category' })
		},
		goLogin() {
			if (storage.getToken()) {
				uni.showToast({ title: '已登录', icon: 'none' })
				return
			}
			uni.navigateTo({ url: '/pages/login/login' })
		},
		goBalance() {
			if (!storage.getToken()) return this.goLogin()
			uni.navigateTo({ url: '/pages/balance/balance' })
		},
		goTransactions() {
			if (!storage.getToken()) return this.goLogin()
			uni.navigateTo({ url: '/pages/balance/transactions' })
		},
		goShopList() {
			uni.navigateTo({ url: '/pages/shop/list' })
		},
		goShopDetail(id) {
			uni.navigateTo({ url: '/pages/shop/detail?id=' + id })
		},
		goGoodsList() {
			uni.navigateTo({ url: '/pages/goods/list' })
		},
		goGoodsDetail(id) {
			uni.navigateTo({ url: '/pages/goods/detail?id=' + id })
		},
		goNoticeList() {
			uni.navigateTo({ url: '/pages/message/message' })
		},
		async addToCart(item) {
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
	padding-bottom: 160rpx;
}
.brand {
	padding: 70rpx 0 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	background: #fff;
}
.brand-logo {
	width: 160rpx;
	height: 160rpx;
	border-radius: 80rpx;
	background: #f4f4f4;
}
.brand-name {
	font-size: 44rpx;
	color: #111;
	font-weight: 800;
	margin-top: 18rpx;
	letter-spacing: 4rpx;
}
.delivery-grid {
	display: flex;
	justify-content: space-between;
	gap: 18rpx;
	background: #fff;
	padding: 26rpx 26rpx 30rpx;
}
.delivery-item {
	flex: 1;
	background: #f3f3f3;
	border-radius: 16rpx;
	padding: 24rpx 0;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.delivery-icon {
	width: 92rpx;
	height: 92rpx;
	border-radius: 20rpx;
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
	font-weight: 700;
	color: #111;
}
.delivery-text {
	margin-top: 16rpx;
	font-size: 24rpx;
	color: #111;
}
.welcome-card {
	margin: 18rpx 20rpx;
	background: #fff;
	border-radius: 18rpx;
	padding: 22rpx 22rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-shadow: 0 6rpx 18rpx rgba(0,0,0,0.04);
}
.welcome-title {
	font-size: 30rpx;
	font-weight: 800;
	color: #111;
	display: block;
}
.welcome-sub {
	font-size: 24rpx;
	color: #777;
	margin-top: 8rpx;
	display: block;
}
.welcome-btn {
	margin: 0;
	padding: 0 28rpx;
	height: 64rpx;
	line-height: 64rpx;
	border-radius: 32rpx;
	background: #111;
	color: #fff;
	font-size: 26rpx;
}
.quick-grid {
	margin: 0 20rpx 18rpx;
	background: #fff;
	border-radius: 18rpx;
	display: flex;
	padding: 18rpx 0;
}
.quick-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.quick-icon {
	width: 96rpx;
	height: 96rpx;
	border-radius: 18rpx;
	background: #f3f3f3;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	color: #111;
	font-weight: 700;
}
.quick-text {
	margin-top: 14rpx;
	font-size: 24rpx;
	color: #111;
}
.notice-card {
	margin: 0 20rpx 18rpx;
	background: #fff;
	border-radius: 18rpx;
	padding: 18rpx 18rpx;
	display: flex;
	align-items: center;
	box-shadow: 0 6rpx 18rpx rgba(0,0,0,0.04);
}
.notice-badge {
	background: #111;
	color: #fff;
	font-size: 22rpx;
	padding: 8rpx 14rpx;
	border-radius: 12rpx;
	margin-right: 18rpx;
}
.notice-swiper {
	flex: 1;
	height: 40rpx;
}
.notice-text {
	font-size: 26rpx;
	color: #333;
}
.notice-more {
	margin-left: 14rpx;
	font-size: 24rpx;
	color: #999;
}
.banner {
	margin: 0 20rpx 18rpx;
	height: 280rpx;
	border-radius: 18rpx;
	overflow: hidden;
}
.banner-img {
	width: 100%;
	height: 100%;
}
.section {
	margin: 0 20rpx 18rpx;
	background: #fff;
	border-radius: 18rpx;
	padding: 20rpx;
	box-shadow: 0 6rpx 18rpx rgba(0,0,0,0.04);
}
.section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 18rpx;
}
.section-title {
	font-size: 30rpx;
	font-weight: 800;
	color: #111;
}
.section-more {
	font-size: 24rpx;
	color: #999;
}
.shop-scroll {
	white-space: nowrap;
}
.shop-item {
	display: inline-block;
	width: 200rpx;
	margin-right: 18rpx;
}
.shop-logo {
	width: 200rpx;
	height: 140rpx;
	border-radius: 14rpx;
	background: #f3f3f3;
}
.shop-name {
	margin-top: 12rpx;
	font-size: 26rpx;
	color: #111;
	font-weight: 700;
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.shop-meta {
	margin-top: 6rpx;
	font-size: 22rpx;
	color: #999;
	display: block;
}
.goods-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}
.goods-item {
	width: 48%;
	background: #f8f8f8;
	border-radius: 16rpx;
	overflow: hidden;
	margin-bottom: 18rpx;
}
.goods-img {
	width: 100%;
	height: 260rpx;
	background: #eee;
}
.goods-info {
	padding: 16rpx;
}
.goods-name {
	font-size: 26rpx;
	color: #111;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	height: 72rpx;
	line-height: 1.4;
}
.goods-bottom {
	margin-top: 14rpx;
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
	width: 52rpx;
	height: 52rpx;
	border-radius: 26rpx;
	background: #111;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 34rpx;
}
</style>

