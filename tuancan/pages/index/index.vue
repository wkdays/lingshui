<template>
	<view class="container">
		<!-- 状态栏占位 -->
		<view class="status-bar"></view>
		
		<!-- 轮播图区域 -->
		<view class="banner-wrapper">
			<swiper class="banner" indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff" autoplay circular>
				<swiper-item v-for="item in banners" :key="item.id" @click="onBannerClick(item)">
					<view class="banner-item">
						<image class="banner-bg" :src="item.image" mode="aspectFill"></image>
						<view class="banner-overlay"></view>
						<view class="banner-content">
							<text class="banner-title">{{item.title1}}</text>
							<text class="banner-title">{{item.title2}}</text>
							<text class="banner-sub">{{item.sub}}</text>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<!-- 公告栏（滚动显示团购业务公告） -->
		<view class="notice-bar" @click="goToNotice">
			<view class="notice-icon-wrap">
				<text class="notice-emoji">📢</text>
			</view>
			<swiper class="notice-swiper" vertical autoplay circular :interval="3000">
				<swiper-item v-for="notice in notices" :key="notice.id">
					<text class="notice-text">{{notice.title}}</text>
				</swiper-item>
			</swiper>
			<text class="notice-arrow">→</text>
		</view>
		
		<!-- 日期选择器 -->
		<view class="date-selector">
			<text class="date-btn" @click="prevWeek">← 上一页</text>
			<text class="date-current">当前({{dateRange}})</text>
			<text class="date-btn" @click="nextWeek">下一页 →</text>
		</view>
		
		<!-- 餐次筛选 -->
		<view class="meal-filter">
			<view 
				class="filter-item" 
				:class="{active: currentMealFilter === 'all'}" 
				@click="setMealFilter('all')">全选</view>
			<view 
				class="filter-item" 
				:class="{active: currentMealFilter === 'breakfast'}" 
				@click="setMealFilter('breakfast')">早餐</view>
			<view 
				class="filter-item" 
				:class="{active: currentMealFilter === 'lunch'}" 
				@click="setMealFilter('lunch')">午餐</view>
			<view 
				class="filter-item" 
				:class="{active: currentMealFilter === 'dinner'}" 
				@click="setMealFilter('dinner')">晚餐</view>
		</view>
		
		<!-- 周餐次列表 -->
		<view class="meal-list">
			<view class="meal-row" v-for="(day, index) in weekMeals" :key="index">
				<view class="day-info">
					<view class="day-text">
						<text class="day-name">{{day.weekDay}}</text>
						<text class="day-date">({{day.date}})</text>
					</view>
					<view class="day-menu-btn" @click="showDayMenu(day)">
						<text class="menu-icon">📋</text>
					</view>
				</view>
				<view class="meal-options">
					<view 
						class="meal-btn" 
						:class="{selected: day.breakfast.selected, disabled: currentMealFilter !== 'all' && currentMealFilter !== 'breakfast'}"
						@click="toggleMeal(index, 'breakfast')">
						早餐
					</view>
					<view 
						class="meal-btn" 
						:class="{selected: day.lunch.selected, disabled: currentMealFilter !== 'all' && currentMealFilter !== 'lunch'}"
						@click="toggleMeal(index, 'lunch')">
						午餐
					</view>
					<view 
						class="meal-btn" 
						:class="{selected: day.dinner.selected, disabled: currentMealFilter !== 'all' && currentMealFilter !== 'dinner'}"
						@click="toggleMeal(index, 'dinner')">
						晚餐
					</view>
				</view>
			</view>
		</view>
		
		<!-- 底部结算栏 -->
		<view class="bottom-bar">
			<view class="price-info">
				<text class="price-label">支付费用：</text>
				<text class="price-symbol">¥</text>
				<text class="price-amount">{{totalPrice.toFixed(2)}}</text>
				<text class="meal-count">共计：{{totalMealCount}}餐</text>
			</view>
			<view class="submit-btn" @click="addToCart">加入购物车</view>
		</view>
		
		<!-- 菜单详情弹窗 - 展示菜品图片、简介、单价，支持选择份数 -->
		<view class="menu-popup" v-if="showMenuPopup" @click="closeMenuPopup">
			<view class="menu-content" @click.stop>
				<view class="menu-header">
					<text class="menu-title">{{currentDayMenu.weekDay}} ({{currentDayMenu.date}}) 菜单</text>
					<text class="menu-close" @click="closeMenuPopup">×</text>
				</view>
				<scroll-view class="menu-list" scroll-y>
					<!-- 早餐菜品 -->
					<view class="menu-section">
						<view class="section-header">
							<text class="section-icon">🌅</text>
							<text class="section-name">早餐</text>
						</view>
						<view class="dish-list">
							<view class="dish-item" v-for="dish in breakfastDishes" :key="dish.id">
								<image class="dish-image" :src="dish.image" mode="aspectFill"></image>
								<view class="dish-info">
									<text class="dish-name">{{dish.name}}</text>
									<text class="dish-desc">{{dish.description}}</text>
									<view class="dish-bottom">
										<text class="dish-price">¥{{dish.price}}</text>
										<view class="quantity-ctrl">
											<text class="qty-btn" @click="changeQty(dish, -1)">-</text>
											<text class="qty-num">{{dish.quantity || 0}}</text>
											<text class="qty-btn" @click="changeQty(dish, 1)">+</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 午餐菜品 -->
					<view class="menu-section">
						<view class="section-header">
							<text class="section-icon">☀️</text>
							<text class="section-name">午餐</text>
						</view>
						<view class="dish-list">
							<view class="dish-item" v-for="dish in lunchDishes" :key="dish.id">
								<image class="dish-image" :src="dish.image" mode="aspectFill"></image>
								<view class="dish-info">
									<text class="dish-name">{{dish.name}}</text>
									<text class="dish-desc">{{dish.description}}</text>
									<view class="dish-bottom">
										<text class="dish-price">¥{{dish.price}}</text>
										<view class="quantity-ctrl">
											<text class="qty-btn" @click="changeQty(dish, -1)">-</text>
											<text class="qty-num">{{dish.quantity || 0}}</text>
											<text class="qty-btn" @click="changeQty(dish, 1)">+</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 晚餐菜品 -->
					<view class="menu-section">
						<view class="section-header">
							<text class="section-icon">🌙</text>
							<text class="section-name">晚餐</text>
						</view>
						<view class="dish-list">
							<view class="dish-item" v-for="dish in dinnerDishes" :key="dish.id">
								<image class="dish-image" :src="dish.image" mode="aspectFill"></image>
								<view class="dish-info">
									<text class="dish-name">{{dish.name}}</text>
									<text class="dish-desc">{{dish.description}}</text>
									<view class="dish-bottom">
										<text class="dish-price">¥{{dish.price}}</text>
										<view class="quantity-ctrl">
											<text class="qty-btn" @click="changeQty(dish, -1)">-</text>
											<text class="qty-num">{{dish.quantity || 0}}</text>
											<text class="qty-btn" @click="changeQty(dish, 1)">+</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<!-- 弹窗底部结算 -->
				<view class="popup-footer">
					<view class="popup-total">
						<text>已选 {{popupTotalCount}} 份</text>
						<text class="popup-price">¥{{popupTotalPrice.toFixed(2)}}</text>
					</view>
					<view class="popup-btn" @click="addDishesToCart">加入购物车</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { homeApi, cartApi } from '@/api/mock.js'
import store from '@/store/index.js'

export default {
	data() {
		return {
			banners: [
				{ id: 1, image: '/static/images/banner1.png', title1: '健康饮食', title2: '美好生活', sub: '健康搭配每一天' },
				{ id: 2, image: '/static/images/banner2.png', title1: '新用户', title2: '首单立减', sub: '新人专享优惠' },
				{ id: 3, image: '/static/images/banner3.png', title1: '限时特惠', title2: '火热进行', sub: '超值折扣等你来' }
			],
			notices: [
				{ id: 1, title: '食堂公告：本周菜单已更新，欢迎选购！' }
			],
			weekMeals: [],
			currentWeekStart: new Date(),
			currentMealFilter: 'all',
			dateRange: '',
			showMenuPopup: false,
			currentDayMenu: {},
			breakfastDishes: [
				{ id: 'b1', name: '营养早餐套餐', image: '/static/images/food1.png', description: '白粥+馒头+鸡蛋+小菜', price: 8, quantity: 0 },
				{ id: 'b2', name: '豆浆油条套餐', image: '/static/images/food2.png', description: '现磨豆浆+金黄油条', price: 6, quantity: 0 },
				{ id: 'b3', name: '蛋炒饭套餐', image: '/static/images/food3.png', description: '鸡蛋炒饭+紫菜汤', price: 10, quantity: 0 }
			],
			lunchDishes: [
				{ id: 'l1', name: '红烧肉套餐', image: '/static/images/food4.png', description: '红烧肉+时蔬+米饭+汤', price: 18, quantity: 0 },
				{ id: 'l2', name: '糖醋排骨套餐', image: '/static/images/food5.png', description: '糖醋排骨+青菜+米饭', price: 20, quantity: 0 },
				{ id: 'l3', name: '宫保鸡丁套餐', image: '/static/images/food6.png', description: '宫保鸡丁+配菜+米饭', price: 16, quantity: 0 },
				{ id: 'l4', name: '番茄牛腩套餐', image: '/static/images/food7.png', description: '番茄牛腩+米饭+例汤', price: 22, quantity: 0 }
			],
			dinnerDishes: [
				{ id: 'd1', name: '清淡晚餐套餐', image: '/static/images/food8.png', description: '蒜蓉西兰花+蛋花汤+米饭', price: 15, quantity: 0 },
				{ id: 'd2', name: '营养晚餐套餐', image: '/static/images/food1.png', description: '清蒸鱼+时蔬+米饭', price: 18, quantity: 0 },
				{ id: 'd3', name: '素食套餐', image: '/static/images/food2.png', description: '三鲜豆腐+炒青菜+米饭', price: 12, quantity: 0 }
			],
			selectedDishes: []
		}
	},
	computed: {
		totalPrice() {
			let total = 0
			this.weekMeals.forEach(day => {
				if (day.breakfast.selected) total += day.breakfast.price
				if (day.lunch.selected) total += day.lunch.price
				if (day.dinner.selected) total += day.dinner.price
			})
			return total
		},
		totalMealCount() {
			let count = 0
			this.weekMeals.forEach(day => {
				if (day.breakfast.selected) count++
				if (day.lunch.selected) count++
				if (day.dinner.selected) count++
			})
			return count
		},
		popupTotalCount() {
			let count = 0
			this.breakfastDishes.forEach(d => count += d.quantity || 0)
			this.lunchDishes.forEach(d => count += d.quantity || 0)
			this.dinnerDishes.forEach(d => count += d.quantity || 0)
			return count
		},
		popupTotalPrice() {
			let total = 0
			this.breakfastDishes.forEach(d => total += (d.quantity || 0) * d.price)
			this.lunchDishes.forEach(d => total += (d.quantity || 0) * d.price)
			this.dinnerDishes.forEach(d => total += (d.quantity || 0) * d.price)
			return total
		}
	},
	onLoad() {
		this.initData()
	},
	methods: {
		async initData() {
			await this.loadBanners()
			await this.loadNotices()
			this.loadWeekMeals()
		},
		async loadBanners() {
			const res = await homeApi.getBanners()
			if (res.code === 0) {
				this.banners = res.data
			}
		},
		async loadNotices() {
			const res = await homeApi.getNotices()
			if (res.code === 0) {
				this.notices = res.data
			}
		},
		async loadWeekMeals() {
			const res = await homeApi.getWeekMeals(this.currentWeekStart)
			if (res.code === 0) {
				this.weekMeals = res.data
				this.updateDateRange()
			}
		},
		updateDateRange() {
			if (this.weekMeals.length > 0) {
				const first = this.weekMeals[0].date
				const last = this.weekMeals[this.weekMeals.length - 1].date
				this.dateRange = `${first}至${last}`
			}
		},
		prevWeek() {
			this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7)
			this.loadWeekMeals()
		},
		nextWeek() {
			this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7)
			this.loadWeekMeals()
		},
		setMealFilter(filter) {
			this.currentMealFilter = filter
		},
		toggleMeal(dayIndex, mealType) {
			if (this.currentMealFilter !== 'all' && this.currentMealFilter !== mealType) return
			this.weekMeals[dayIndex][mealType].selected = !this.weekMeals[dayIndex][mealType].selected
		},
		showDayMenu(day) {
			this.currentDayMenu = day
			// 重置菜品数量
			this.breakfastDishes.forEach(d => d.quantity = 0)
			this.lunchDishes.forEach(d => d.quantity = 0)
			this.dinnerDishes.forEach(d => d.quantity = 0)
			this.showMenuPopup = true
		},
		closeMenuPopup() {
			this.showMenuPopup = false
		},
		changeQty(dish, delta) {
			const newQty = (dish.quantity || 0) + delta
			if (newQty >= 0 && newQty <= 99) {
				dish.quantity = newQty
			}
		},
		async addDishesToCart() {
			if (this.popupTotalCount === 0) {
				uni.showToast({ title: '请选择菜品', icon: 'none' })
				return
			}
			// 收集已选菜品加入购物车
			const allDishes = [...this.breakfastDishes, ...this.lunchDishes, ...this.dinnerDishes]
			let addedCount = 0
			for (const dish of allDishes) {
				if (dish.quantity > 0) {
					const cartItem = {
						id: dish.id,
						name: dish.name,
						image: dish.image,
						price: dish.price,
						spec: `${this.currentDayMenu.date} ${this.currentDayMenu.weekDay}`
					}
					await cartApi.addToCart(cartItem, dish.quantity)
					addedCount += dish.quantity
				}
			}
			// 更新购物车状态
			const cartRes = await cartApi.getCart()
			if (cartRes.code === 0) {
				store.setCart(cartRes.data)
			}
			this.showMenuPopup = false
			uni.showToast({ title: `已加入${addedCount}件商品`, icon: 'success' })
		},
		goToNotice() {
			uni.navigateTo({ url: '/pages/notice/list' })
		},
		onBannerClick(item) {
			if (item.link) {
				uni.navigateTo({ url: item.link })
			}
		},
		async addToCart() {
			if (this.totalMealCount === 0) {
				uni.showToast({ title: '请选择至少一餐', icon: 'none' })
				return
			}
			// 将选中的餐次加入购物车
			let addedCount = 0
			for (const day of this.weekMeals) {
				if (day.breakfast.selected) {
					await cartApi.addToCart({
						id: `meal_${day.date}_breakfast`,
						name: `${day.date} 早餐`,
						image: '/static/images/food1.png',
						price: day.breakfast.price,
						spec: day.weekDay
					}, 1)
					addedCount++
				}
				if (day.lunch.selected) {
					await cartApi.addToCart({
						id: `meal_${day.date}_lunch`,
						name: `${day.date} 午餐`,
						image: '/static/images/food4.png',
						price: day.lunch.price,
						spec: day.weekDay
					}, 1)
					addedCount++
				}
				if (day.dinner.selected) {
					await cartApi.addToCart({
						id: `meal_${day.date}_dinner`,
						name: `${day.date} 晚餐`,
						image: '/static/images/food8.png',
						price: day.dinner.price,
						spec: day.weekDay
					}, 1)
					addedCount++
				}
			}
			// 更新购物车状态
			const cartRes = await cartApi.getCart()
			if (cartRes.code === 0) {
				store.setCart(cartRes.data)
			}
			// 重置选择状态
			this.weekMeals.forEach(day => {
				day.breakfast.selected = false
				day.lunch.selected = false
				day.dinner.selected = false
			})
			uni.showToast({ title: `已加入${addedCount}餐`, icon: 'success' })
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: #f5f5f5;
	padding-bottom: 140rpx;
}

.status-bar {
	height: var(--status-bar-height);
	background: transparent;
}

/* 轮播图样式 */
.banner-wrapper {
	padding: 20rpx 24rpx;
}

.banner {
	width: 100%;
	height: 280rpx;
	border-radius: 24rpx;
	overflow: hidden;
}

.banner-item {
	width: 100%;
	height: 100%;
	position: relative;
	border-radius: 24rpx;
	overflow: hidden;
}

.banner-bg {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
}

.banner-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%);
	z-index: 1;
}

.banner-content {
	position: absolute;
	left: 40rpx;
	top: 50%;
	transform: translateY(-50%);
	z-index: 10;
}

.banner-title {
	display: block;
	color: #fff;
	font-size: 44rpx;
	font-weight: bold;
	line-height: 1.3;
	text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.5);
}

.banner-sub {
	display: block;
	color: rgba(255,255,255,0.85);
	font-size: 24rpx;
	margin-top: 16rpx;
}

.banner-food {
	position: absolute;
	right: -20rpx;
	top: 50%;
	transform: translateY(-50%);
	width: 320rpx;
	height: 320rpx;
	z-index: 2;
}

/* 公告栏 */
.notice-bar {
	margin: 0 24rpx 20rpx;
	padding: 24rpx 28rpx;
	background: #fff;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}

.notice-icon-wrap {
	margin-right: 16rpx;
}

.notice-emoji {
	font-size: 36rpx;
}

.notice-swiper {
	flex: 1;
	height: 40rpx;
}

.notice-text {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
	display: block;
	line-height: 40rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.notice-arrow {
	color: #ccc;
	font-size: 36rpx;
	font-weight: 300;
}

/* 日期选择器 */
.date-selector {
	margin: 0 24rpx 20rpx;
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx 28rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}

.date-btn {
	font-size: 28rpx;
	color: #666;
	padding: 8rpx 16rpx;
}

.date-current {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

/* 餐次筛选 */
.meal-filter {
	display: flex;
	padding: 0 24rpx;
	margin-bottom: 20rpx;
}

.filter-item {
	padding: 14rpx 36rpx;
	margin-right: 16rpx;
	font-size: 28rpx;
	color: #666;
	background: #fff;
	border-radius: 32rpx;
	border: 2rpx solid #e8e8e8;
}

.filter-item.active {
	color: #10B981;
	border-color: #10B981;
	background: rgba(16, 185, 129, 0.08);
	font-weight: 500;
}

/* 餐次列表 */
.meal-list {
	margin: 0 24rpx;
	background: #fff;
	border-radius: 16rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}

.meal-row {
	display: flex;
	align-items: center;
	padding: 28rpx 24rpx;
	border-bottom: 1rpx solid #f5f5f5;
}

.meal-row:last-child {
	border-bottom: none;
}

.day-info {
	width: 160rpx;
	display: flex;
	align-items: center;
}

.day-text {
	display: flex;
	flex-direction: column;
}

.day-name {
	font-size: 30rpx;
	color: #333;
	font-weight: 600;
}

.day-date {
	font-size: 24rpx;
	color: #999;
	margin-top: 4rpx;
}

.day-menu-btn {
	margin-left: 12rpx;
}

.menu-icon {
	font-size: 28rpx;
}

.meal-options {
	flex: 1;
	display: flex;
	justify-content: flex-end;
	gap: 16rpx;
}

.meal-btn {
	width: 130rpx;
	height: 64rpx;
	line-height: 64rpx;
	text-align: center;
	font-size: 28rpx;
	color: #666;
	background: #f8f8f8;
	border-radius: 32rpx;
	border: 2rpx solid #e8e8e8;
	transition: all 0.2s;
}

.meal-btn.selected {
	color: #fff;
	background: linear-gradient(135deg, #34D399 0%, #10B981 100%);
	border-color: transparent;
	font-weight: 500;
}

.meal-btn.disabled {
	opacity: 0.4;
}

/* 底部结算栏 */
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 110rpx;
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 32rpx;
	box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
	padding-bottom: env(safe-area-inset-bottom);
}

.price-info {
	flex: 1;
	display: flex;
	align-items: baseline;
}

.price-label {
	font-size: 28rpx;
	color: #666;
}

.price-symbol {
	font-size: 28rpx;
	color: #10B981;
	font-weight: bold;
}

.price-amount {
	font-size: 40rpx;
	color: #10B981;
	font-weight: bold;
}

.meal-count {
	font-size: 24rpx;
	color: #999;
	margin-left: 12rpx;
}

.submit-btn {
	min-width: 200rpx;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	background: linear-gradient(135deg, #34D399 0%, #10B981 100%);
	color: #fff;
	font-size: 30rpx;
	font-weight: 600;
	border-radius: 40rpx;
	flex-shrink: 0;
}

/* 菜单弹窗 */
.menu-popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0,0.5);
	z-index: 999;
	display: flex;
	align-items: center;
	justify-content: center;
}

.menu-content {
	width: 90%;
	max-height: 80vh;
	background: #fff;
	border-radius: 24rpx;
	overflow: hidden;
}

.menu-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 32rpx;
	background: linear-gradient(135deg, #34D399 0%, #10B981 100%);
}

.menu-title {
	font-size: 34rpx;
	color: #fff;
	font-weight: bold;
}

.menu-close {
	font-size: 48rpx;
	color: #fff;
	line-height: 1;
}

.menu-list {
	max-height: 60vh;
	padding: 20rpx;
}

.menu-section {
	margin-bottom: 30rpx;
	background: #f8f8f8;
	border-radius: 16rpx;
	overflow: hidden;
}

.section-header {
	display: flex;
	align-items: center;
	padding: 24rpx;
	background: #fff;
	border-bottom: 1rpx solid #f0f0f0;
}

.section-icon {
	font-size: 36rpx;
	margin-right: 12rpx;
}

.section-name {
	flex: 1;
	font-size: 30rpx;
	color: #333;
	font-weight: 600;
}

.section-price {
	font-size: 32rpx;
	color: #10B981;
	font-weight: bold;
}

.menu-items {
	padding: 16rpx 24rpx;
}

.menu-item {
	display: inline-block;
	background: #fff;
	padding: 12rpx 24rpx;
	border-radius: 8rpx;
	margin: 8rpx;
}

.item-name {
	font-size: 26rpx;
	color: #666;
}

/* 菜品列表样式 */
.dish-list {
	padding: 16rpx;
}

.dish-item {
	display: flex;
	background: #fff;
	border-radius: 12rpx;
	padding: 16rpx;
	margin-bottom: 16rpx;
}

.dish-image {
	width: 140rpx;
	height: 140rpx;
	border-radius: 12rpx;
	flex-shrink: 0;
}

.dish-info {
	flex: 1;
	margin-left: 20rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.dish-name {
	font-size: 30rpx;
	color: #333;
	font-weight: 600;
}

.dish-desc {
	font-size: 24rpx;
	color: #999;
	margin-top: 8rpx;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.dish-bottom {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 12rpx;
}

.dish-price {
	font-size: 32rpx;
	color: #ff6b00;
	font-weight: bold;
}

.quantity-ctrl {
	display: flex;
	align-items: center;
}

.qty-btn {
	width: 48rpx;
	height: 48rpx;
	line-height: 44rpx;
	text-align: center;
	background: #f0f0f0;
	border-radius: 50%;
	font-size: 32rpx;
	color: #666;
}

.qty-btn:active {
	background: #e0e0e0;
}

.qty-num {
	width: 60rpx;
	text-align: center;
	font-size: 28rpx;
	color: #333;
}

/* 弹窗底部 */
.popup-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 32rpx;
	background: #fff;
	border-top: 1rpx solid #f0f0f0;
}

.popup-total {
	font-size: 28rpx;
	color: #666;
}

.popup-price {
	font-size: 36rpx;
	color: #ff6b00;
	font-weight: bold;
	margin-left: 16rpx;
}

.popup-btn {
	background: linear-gradient(135deg, #34D399 0%, #10B981 100%);
	color: #fff;
	font-size: 30rpx;
	font-weight: bold;
	padding: 20rpx 48rpx;
	border-radius: 40rpx;
}

.popup-btn:active {
	opacity: 0.9;
}
</style>
