<template>
	<view class="tabbar-wrapper">
		<view class="tabbar">
			<view
				class="tabbar-item"
				:class="{active: current === index}"
				v-for="(item, index) in list"
				:key="item.pagePath"
				@click="switchTab(item, index)"
			>
				<view class="icon-wrapper">
					<image class="icon" :src="current === index ? item.iconActive : item.icon" mode="aspectFit"></image>
					<view class="badge" v-if="item.badge && item.badge > 0">{{item.badge > 99 ? '99+' : item.badge}}</view>
				</view>
				<text class="text" :class="{active: current === index}">{{item.text}}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'CustomTabbar',
	props: {
		current: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			list: [
				{ pagePath: '/pages/index/index', text: '首页', icon: '/static/tabbar/home.png', iconActive: '/static/tabbar/home-active.png' },
				{ pagePath: '/pages/category/category', text: '点单', icon: '/static/tabbar/category.png', iconActive: '/static/tabbar/category-active.png' },
				{ pagePath: '/pages/cart/cart', text: '购物车', icon: '/static/tabbar/cart.png', iconActive: '/static/tabbar/cart-active.png', badge: 0 },
				{ pagePath: '/pages/mine/mine', text: '我的', icon: '/static/tabbar/mine.png', iconActive: '/static/tabbar/mine-active.png' }
			]
		}
	},
	mounted() {
		this.updateCartBadge()
	},
	methods: {
		switchTab(item, index) {
			if (this.current === index) return
			uni.switchTab({ url: item.pagePath })
		},
		updateCartBadge() {
			const cart = uni.getStorageSync('tg_cart')
			if (!cart) return
			try {
				const cartList = JSON.parse(cart)
				this.list[2].badge = cartList.reduce((sum, item) => sum + item.count, 0)
			} catch (e) {}
		}
	}
}
</script>

<style scoped>
.tabbar-wrapper {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 999;
}
.tabbar {
	height: auto;
	min-height: 100rpx;
	background: #fff;
	display: flex;
	box-shadow: 0 -4rpx 18rpx rgba(0,0,0,0.06);
	border-top: 1rpx solid rgba(0,0,0,0.06);
	padding: 16rpx 0;
}
.tabbar-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 10rpx 0;
	position: relative;
}
.icon-wrapper {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 56rpx;
	height: 56rpx;
}
.icon {
	width: 48rpx;
	height: 48rpx;
}
.text {
	font-size: 24rpx;
	color: #9b9b9b;
	margin-top: 6rpx;
}
.text.active {
	color: #111;
	font-weight: 600;
}
.badge {
	position: absolute;
	top: -6rpx;
	right: -16rpx;
	min-width: 36rpx;
	height: 36rpx;
	line-height: 36rpx;
	text-align: center;
	background: #111;
	color: #fff;
	font-size: 20rpx;
	border-radius: 18rpx;
	padding: 0 10rpx;
	font-weight: 600;
}
</style>

