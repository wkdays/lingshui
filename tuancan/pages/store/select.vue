<template>
	<view class="container">
		<!-- 状态栏占位 -->
		<view class="status-bar"></view>
		
		<!-- 头部区域 -->
		<view class="header">
			<view class="header-left">
				<image class="logo" src="/static/logo.png" mode="aspectFit"></image>
				<view class="title-wrap">
					<text class="title">陵水团餐供应链</text>
					<text class="subtitle">健康饮食 · 品质保障</text>
				</view>
			</view>
		</view>
		
		<!-- 功能入口区域 -->
		<view class="function-section">
			<view class="function-grid">
				<view class="function-item" @click="goToMeal('lt')">
					<view class="function-icon lt-meal">
						<text class="icon-text">LT餐</text>
					</view>
					<text class="function-name">LT餐</text>
				</view>
				<view class="function-item" @click="goToMeal('weekly')">
					<view class="function-icon weekly-meal">
						<text class="icon-text">周期餐</text>
					</view>
					<text class="function-name">周期餐</text>
				</view>
				<view class="function-item" @click="clearCart">
					<view class="function-icon clear-cart">
						<text class="icon-emoji">🛒</text>
					</view>
					<text class="function-name">清除购物袋</text>
				</view>
			</view>
		</view>
		
		<!-- 菜品展示区域 -->
		<view class="showcase-section">
			<view class="section-header">
				<text class="section-title">菜品展示</text>
			</view>
			<scroll-view class="showcase-scroll" scroll-x>
				<view class="showcase-list">
					<view class="showcase-item" v-for="item in showcaseItems" :key="item.id">
						<image class="showcase-image" :src="item.image" mode="aspectFill"></image>
						<text class="showcase-name">{{item.name}}</text>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 门店选择入口 -->
		<view class="store-entry" @click="showStorePicker">
			<view class="store-entry-content">
				<view class="store-icon-wrap">
					<text class="store-icon">🏪</text>
				</view>
				<view class="store-info">
					<text class="store-label">门店选择</text>
					<text class="store-hint">{{selectedStore ? selectedStore.name : '请选择虚拟门店'}}</text>
				</view>
			</view>
			<text class="store-arrow">›</text>
		</view>
		
		<!-- 门店选择弹窗 -->
		<view class="store-popup" v-if="showStorePopup" @click="closeStorePicker">
			<view class="popup-content" @click.stop>
				<view class="popup-header">
					<text class="popup-title">选择虚拟门店</text>
					<text class="popup-close" @click="closeStorePicker">×</text>
				</view>
				<scroll-view class="store-list" scroll-y>
					<view 
						class="store-item" 
						v-for="store in storeList" 
						:key="store.id"
						:class="{active: selectedStore && selectedStore.id === store.id}"
						@click="selectStore(store)">
						<view class="store-item-icon">🏢</view>
						<view class="store-item-info">
							<text class="store-item-name">{{store.name}}</text>
							<text class="store-item-address">{{store.address}}</text>
						</view>
						<view class="store-item-check" v-if="selectedStore && selectedStore.id === store.id">✓</view>
					</view>
				</scroll-view>
				<view class="popup-footer">
					<view class="confirm-btn" :class="{disabled: !selectedStore}" @click="confirmStore">
						确认选择
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showcaseItems: [
				{ id: 1, name: '营养早餐', image: '/static/images/food1.png' },
				{ id: 2, name: '精品午餐', image: '/static/images/food2.png' },
				{ id: 3, name: '健康晚餐', image: '/static/images/food3.png' },
				{ id: 4, name: '特色套餐', image: '/static/images/food4.png' }
			],
			storeList: [
				{ id: 1, name: '机关食堂', address: '政府大楼A座1楼' },
				{ id: 2, name: '学校食堂', address: '教学楼B区负一楼' },
				{ id: 3, name: '企业食堂', address: '产业园C栋1楼' },
				{ id: 4, name: '医院食堂', address: '住院部裙楼2楼' },
				{ id: 5, name: '社区食堂', address: '社区服务中心1楼' }
			],
			selectedStore: null,
			showStorePopup: false
		}
	},
	onLoad() {
		// 检查是否已选择门店
		const store = uni.getStorageSync('selectedStore')
		if (store) {
			this.selectedStore = store
		}
	},
	methods: {
		goToMeal(type) {
			if (!this.selectedStore) {
				uni.showToast({ title: '请先选择门店', icon: 'none' })
				return
			}
			// 跳转到首页
			uni.switchTab({ url: '/pages/index/index' })
		},
		clearCart() {
			uni.showModal({
				title: '提示',
				content: '确定要清空购物袋吗？',
				success: (res) => {
					if (res.confirm) {
						uni.removeStorageSync('cart')
						uni.showToast({ title: '购物袋已清空', icon: 'success' })
					}
				}
			})
		},
		showStorePicker() {
			this.showStorePopup = true
		},
		closeStorePicker() {
			this.showStorePopup = false
		},
		selectStore(store) {
			this.selectedStore = store
		},
		confirmStore() {
			if (!this.selectedStore) {
				uni.showToast({ title: '请选择门店', icon: 'none' })
				return
			}
			// 保存选择的门店
			uni.setStorageSync('selectedStore', this.selectedStore)
			this.showStorePopup = false
			uni.showToast({ title: '门店选择成功', icon: 'success' })
			// 延迟跳转到首页
			setTimeout(() => {
				uni.switchTab({ url: '/pages/index/index' })
			}, 1000)
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: #f5f5f5;
}

.status-bar {
	height: var(--status-bar-height);
	background: #fff;
}

/* 头部样式 */
.header {
	background: #fff;
	padding: 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.header-left {
	display: flex;
	align-items: center;
}

.logo {
	width: 90rpx;
	height: 90rpx;
	border-radius: 50%;
	margin-right: 20rpx;
}

.title-wrap {
	display: flex;
	flex-direction: column;
}

.title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.subtitle {
	font-size: 24rpx;
	color: #999;
	margin-top: 6rpx;
}

/* 功能入口区域 */
.function-section {
	background: #fff;
	margin: 20rpx 24rpx;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.function-grid {
	display: flex;
	justify-content: space-around;
}

.function-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.function-icon {
	width: 120rpx;
	height: 120rpx;
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 16rpx;
}

.lt-meal {
	background: linear-gradient(135deg, #FFB347 0%, #FF9500 100%);
}

.weekly-meal {
	background: linear-gradient(135deg, #7ED321 0%, #4CD964 100%);
}

.clear-cart {
	background: linear-gradient(135deg, #5AC8FA 0%, #007AFF 100%);
}

.icon-text {
	font-size: 28rpx;
	color: #fff;
	font-weight: bold;
}

.icon-emoji {
	font-size: 48rpx;
}

.function-name {
	font-size: 26rpx;
	color: #666;
}

/* 菜品展示区域 */
.showcase-section {
	background: #fff;
	margin: 0 24rpx 20rpx;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.section-header {
	margin-bottom: 24rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.showcase-scroll {
	white-space: nowrap;
}

.showcase-list {
	display: flex;
}

.showcase-item {
	width: 200rpx;
	margin-right: 20rpx;
	flex-shrink: 0;
}

.showcase-image {
	width: 200rpx;
	height: 200rpx;
	border-radius: 16rpx;
}

.showcase-name {
	display: block;
	font-size: 26rpx;
	color: #333;
	text-align: center;
	margin-top: 12rpx;
}

/* 门店选择入口 */
.store-entry {
	background: linear-gradient(135deg, #FF9500 0%, #FF6B00 100%);
	margin: 20rpx 24rpx;
	border-radius: 20rpx;
	padding: 36rpx 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-shadow: 0 8rpx 30rpx rgba(255, 107, 0, 0.3);
}

.store-entry-content {
	display: flex;
	align-items: center;
}

.store-icon-wrap {
	width: 80rpx;
	height: 80rpx;
	background: rgba(255,255,255,0.2);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 24rpx;
}

.store-icon {
	font-size: 40rpx;
}

.store-info {
	display: flex;
	flex-direction: column;
}

.store-label {
	font-size: 32rpx;
	font-weight: bold;
	color: #fff;
}

.store-hint {
	font-size: 26rpx;
	color: rgba(255,255,255,0.8);
	margin-top: 8rpx;
}

.store-arrow {
	font-size: 48rpx;
	color: #fff;
}

/* 门店选择弹窗 */
.store-popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0,0.5);
	z-index: 999;
	display: flex;
	align-items: flex-end;
}

.popup-content {
	width: 100%;
	max-height: 70vh;
	background: #fff;
	border-radius: 32rpx 32rpx 0 0;
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 36rpx 32rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.popup-title {
	font-size: 34rpx;
	font-weight: bold;
	color: #333;
}

.popup-close {
	font-size: 48rpx;
	color: #999;
	line-height: 1;
}

.store-list {
	max-height: 50vh;
	padding: 20rpx;
}

.store-item {
	display: flex;
	align-items: center;
	padding: 28rpx 24rpx;
	background: #f8f8f8;
	border-radius: 16rpx;
	margin-bottom: 16rpx;
	border: 2rpx solid transparent;
	transition: all 0.2s;
}

.store-item.active {
	background: rgba(255, 149, 0, 0.1);
	border-color: #FF9500;
}

.store-item-icon {
	font-size: 48rpx;
	margin-right: 20rpx;
}

.store-item-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.store-item-name {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
}

.store-item-address {
	font-size: 24rpx;
	color: #999;
	margin-top: 6rpx;
}

.store-item-check {
	width: 48rpx;
	height: 48rpx;
	background: #FF9500;
	color: #fff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	font-weight: bold;
}

.popup-footer {
	padding: 24rpx 32rpx;
	padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
	border-top: 1rpx solid #f0f0f0;
}

.confirm-btn {
	width: 100%;
	height: 96rpx;
	line-height: 96rpx;
	text-align: center;
	background: linear-gradient(135deg, #FF9500 0%, #FF6B00 100%);
	color: #fff;
	font-size: 32rpx;
	font-weight: bold;
	border-radius: 48rpx;
}

.confirm-btn.disabled {
	background: #ccc;
}
</style>
