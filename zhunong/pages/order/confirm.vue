<template>
	<view class="container">
		<!-- 收货方式 -->
		<view class="delivery-section">
			<view class="section-title">收货方式</view>
			<view class="delivery-tabs">
				<view class="delivery-tab" :class="{active: deliveryType === 1}" @click="deliveryType = 1">
					<text>🏪</text><text>到店自取</text>
				</view>
				<view class="delivery-tab" :class="{active: deliveryType === 2}" @click="deliveryType = 2">
					<text>📦</text><text>送到驿站</text>
				</view>
				<view class="delivery-tab" :class="{active: deliveryType === 3}" @click="deliveryType = 3">
					<text>🚚</text><text>送货上门</text>
				</view>
			</view>
		</view>
		
		<!-- 自提点选择 -->
		<view class="address-section" v-if="deliveryType === 1" @click="showPickupPicker = true">
			<text class="section-icon">📍</text>
			<view class="address-info" v-if="selectedPickup">
				<text class="address-name">{{selectedPickup.name}}</text>
				<text class="address-detail">{{selectedPickup.address}}</text>
			</view>
			<text class="address-placeholder" v-else>请选择自提点</text>
			<text class="address-arrow">›</text>
		</view>
		
		<!-- 驿站选择 -->
		<view class="address-section" v-if="deliveryType === 2" @click="showStationPicker = true">
			<text class="section-icon">📦</text>
			<view class="address-info" v-if="selectedStation">
				<text class="address-name">{{selectedStation.name}}</text>
				<text class="address-detail">{{selectedStation.address}}</text>
			</view>
			<text class="address-placeholder" v-else>请选择驿站</text>
			<text class="address-arrow">›</text>
		</view>

		<!-- 收货地址 -->
		<view class="address-section" v-if="deliveryType === 3" @click="goSelectAddress">
			<text class="section-icon">🏠</text>
			<view class="address-info" v-if="selectedAddress">
				<view class="address-top">
					<text class="address-name">{{selectedAddress.name}}</text>
					<text class="address-phone">{{selectedAddress.phone}}</text>
				</view>
				<text class="address-detail">{{selectedAddress.province}}{{selectedAddress.city}}{{selectedAddress.district}}{{selectedAddress.detail}}</text>
			</view>
			<text class="address-placeholder" v-else>请选择收货地址</text>
			<text class="address-arrow">›</text>
		</view>
		
		<!-- 商品列表 -->
		<view class="goods-section">
			<view class="goods-item" v-for="item in orderGoods" :key="item.goodsId">
				<image :src="item.image" mode="aspectFill" class="goods-img"></image>
				<view class="goods-info">
					<text class="goods-name">{{item.name}}</text>
					<view class="goods-bottom">
						<text class="goods-price">¥{{item.price}}</text>
						<text class="goods-count">x{{item.count}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 支付方式 -->
		<view class="pay-section">
			<view class="section-title">支付方式</view>
			<view class="pay-item" :class="{active: payType === 'balance'}" @click="payType = 'balance'">
				<text class="pay-icon">💰</text>
				<text class="pay-name">余额支付</text>
				<text class="pay-balance">(余额: ¥{{userBalance.toFixed(2)}})</text>
				<view class="pay-check" v-if="payType === 'balance'">✓</view>
			</view>
		</view>
		
		<!-- 金额明细 -->
		<view class="amount-section">
			<view class="amount-item">
				<text>商品金额</text>
				<text>¥{{totalPrice.toFixed(2)}}</text>
			</view>
			<view class="amount-item">
				<text>配送费</text>
				<text>¥0.00</text>
			</view>
		</view>
		
		<!-- 底部结算栏 -->
		<view class="bottom-bar">
			<view class="total-area">
				<text>合计：</text>
				<text class="total-price">¥{{totalPrice.toFixed(2)}}</text>
			</view>
			<button class="submit-btn" @click="submitOrder">提交订单</button>
		</view>

		<!-- 自提点选择弹窗 -->
		<view class="picker-mask" v-if="showPickupPicker" @click="showPickupPicker = false">
			<view class="picker-content" @click.stop>
				<view class="picker-header">
					<text>选择自提点</text>
					<text class="picker-close" @click="showPickupPicker = false">×</text>
				</view>
				<view class="picker-list">
					<view class="picker-item" v-for="item in pickupPoints" :key="item.id" @click="selectPickup(item)">
						<text class="picker-name">{{item.name}}</text>
						<text class="picker-addr">{{item.address}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 驿站选择弹窗 -->
		<view class="picker-mask" v-if="showStationPicker" @click="showStationPicker = false">
			<view class="picker-content" @click.stop>
				<view class="picker-header">
					<text>选择驿站</text>
					<text class="picker-close" @click="showStationPicker = false">×</text>
				</view>
				<view class="picker-list">
					<view class="picker-item" v-for="item in stations" :key="item.id" @click="selectStation(item)">
						<text class="picker-name">{{item.name}}</text>
						<text class="picker-addr">{{item.address}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import api from '@/api/index.js'
import storage from '@/utils/storage.js'

export default {
	data() {
		return {
			orderGoods: [],
			deliveryType: 3,
			payType: 'balance',
			userBalance: 0,
			selectedAddress: null,
			selectedPickup: null,
			selectedStation: null,
			pickupPoints: [],
			stations: [],
			showPickupPicker: false,
			showStationPicker: false
		}
	},
	computed: {
		totalPrice() {
			return this.orderGoods.reduce((sum, item) => sum + item.price * item.count, 0)
		}
	},
	onLoad() {
		this.orderGoods = uni.getStorageSync('orderGoods') || []
		this.deliveryType = Number(uni.getStorageSync('tg_default_delivery_type')) || 3
		this.loadData()
	},
	onShow() {
		// 每次显示时刷新余额
		this.userBalance = storage.getBalance()
		const addr = uni.getStorageSync('selectedAddress')
		if (addr) {
			this.selectedAddress = addr
			uni.removeStorageSync('selectedAddress')
		}
	},
	methods: {
		async loadData() {
			const balRes = await api.getBalance()
			this.userBalance = balRes.code === 0 ? Number(balRes.data.balance || 0) : storage.getBalance()
			
			const [addrRes, pickupRes, stationRes] = await Promise.all([
				api.getAddresses(),
				api.getPickupPoints(),
				api.getStations()
			])
			this.selectedAddress = addrRes.data.find(a => a.isDefault) || addrRes.data[0]
			this.pickupPoints = pickupRes.data
			this.stations = stationRes.data
		},
		goSelectAddress() {
			uni.navigateTo({ url: '/pages/address/list?select=1' })
		},
		selectPickup(item) {
			this.selectedPickup = item
			this.showPickupPicker = false
		},
		selectStation(item) {
			this.selectedStation = item
			this.showStationPicker = false
		},
		async submitOrder() {
			if (!storage.getToken()) {
				uni.showToast({ title: '请先登录', icon: 'none' })
				uni.navigateTo({ url: '/pages/login/login' })
				return
			}
			if (this.deliveryType === 1 && !this.selectedPickup) {
				uni.showToast({ title: '请选择自提点', icon: 'none' })
				return
			}
			if (this.deliveryType === 2 && !this.selectedStation) {
				uni.showToast({ title: '请选择驿站', icon: 'none' })
				return
			}
			if (this.deliveryType === 3 && !this.selectedAddress) {
				uni.showToast({ title: '请选择收货地址', icon: 'none' })
				return
			}
			if (this.payType === 'balance' && this.userBalance < this.totalPrice) {
				uni.showModal({
					title: '余额不足',
					content: '当前余额不足，是否前往充值？',
					success: (res) => {
						if (res.confirm) uni.navigateTo({ url: '/pages/balance/balance' })
					}
				})
				return
			}
			uni.showLoading({ title: '提交中...' })
			const res = await api.createOrder({
				goods: this.orderGoods,
				deliveryType: this.deliveryType,
				address: this.selectedAddress,
				pickup: this.selectedPickup,
				station: this.selectedStation
			})
			if (res.code !== 0 || !res.data?.orderId) {
				uni.hideLoading()
				uni.showToast({ title: res.message || '下单失败', icon: 'none' })
				return
			}

			const payRes = await api.payOrder({ orderId: res.data.orderId, payType: this.payType })
			uni.hideLoading()
			if (payRes.code !== 0) {
				uni.showToast({ title: payRes.message || '支付失败', icon: 'none' })
				return
			}

			uni.navigateTo({ url: '/pages/order/result?orderId=' + res.data.orderId })
		}
	}
}
</script>

<style>
.container { min-height: 100vh; background: #f5f5f5; padding-bottom: 180rpx; }
.delivery-section { background: #fff; padding: 28rpx; margin-bottom: 20rpx; border-radius: 0 0 20rpx 20rpx; box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04); }
.section-title { font-size: 30rpx; font-weight: bold; color: #333; margin-bottom: 24rpx; }
.delivery-tabs { display: flex; justify-content: space-around; gap: 16rpx; }
.delivery-tab { display: flex; flex-direction: column; align-items: center; padding: 24rpx 32rpx; border-radius: 16rpx; background: #f8f8f8; font-size: 26rpx; color: #666; transition: all 0.2s; flex: 1; }
.delivery-tab.active { background: #111; color: #fff; border: 2rpx solid #111; }
.address-section { display: flex; align-items: center; background: #fff; padding: 28rpx; margin: 0 20rpx 20rpx; border-radius: 16rpx; box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04); }
.section-icon { font-size: 44rpx; margin-right: 20rpx; }
.address-info { flex: 1; }
.address-top { margin-bottom: 10rpx; }
.address-name { font-size: 32rpx; font-weight: bold; color: #333; margin-right: 16rpx; }
.address-phone { font-size: 28rpx; color: #666; }
.address-detail { font-size: 26rpx; color: #666; display: block; line-height: 1.5; }
.address-placeholder { flex: 1; font-size: 28rpx; color: #999; }
.address-arrow { font-size: 28rpx; color: #ccc; }
.goods-section { background: #fff; padding: 28rpx; margin: 0 20rpx 20rpx; border-radius: 16rpx; box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04); }
.goods-item { display: flex; padding: 20rpx 0; border-bottom: 1rpx solid #f5f5f5; }
.goods-item:last-child { border-bottom: none; }
.goods-img { width: 160rpx; height: 160rpx; border-radius: 12rpx; box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.08); }
.goods-info { flex: 1; margin-left: 20rpx; display: flex; flex-direction: column; justify-content: space-between; }
.goods-name { font-size: 28rpx; color: #333; font-weight: 500; }
.goods-bottom { display: flex; justify-content: space-between; align-items: center; }
.goods-price { font-size: 30rpx; color: #FF4444; font-weight: bold; }
.goods-count { font-size: 26rpx; color: #999; background: #f5f5f5; padding: 4rpx 16rpx; border-radius: 8rpx; }
.pay-section { background: #fff; padding: 28rpx; margin: 0 20rpx 20rpx; border-radius: 16rpx; box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04); }
.pay-item { display: flex; align-items: center; padding: 24rpx 0; }
.pay-item.active { color: #111; }
.pay-icon { font-size: 44rpx; margin-right: 20rpx; }
.pay-name { font-size: 30rpx; color: #333; font-weight: 500; }
.pay-balance { font-size: 26rpx; color: #999; margin-left: 12rpx; }
.pay-check { margin-left: auto; color: #111; font-size: 36rpx; font-weight: bold; }
.amount-section { background: #fff; padding: 28rpx; margin: 0 20rpx; border-radius: 16rpx; box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04); }
.amount-item { display: flex; justify-content: space-between; padding: 14rpx 0; font-size: 28rpx; color: #666; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 120rpx; background: #fff; display: flex; align-items: center; padding: 0 24rpx 24rpx; padding-bottom: calc(24rpx + constant(safe-area-inset-bottom)); padding-bottom: calc(24rpx + env(safe-area-inset-bottom)); box-shadow: 0 -4rpx 24rpx rgba(0,0,0,0.1); }
.total-area { flex: 1; font-size: 28rpx; color: #666; }
.total-price { font-size: 40rpx; color: #FF4444; font-weight: bold; }
.submit-btn { background: #111; color: #fff; border-radius: 44rpx; padding: 0 70rpx; height: 88rpx; line-height: 88rpx; font-size: 32rpx; font-weight: 500; box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.18); }
.picker-mask { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; z-index: 999; }
.picker-content { width: 100%; background: #fff; border-radius: 28rpx 28rpx 0 0; max-height: 70vh; }
.picker-header { display: flex; justify-content: space-between; align-items: center; padding: 32rpx; border-bottom: 1rpx solid #f5f5f5; font-size: 34rpx; font-weight: bold; }
.picker-close { font-size: 52rpx; color: #999; }
.picker-list { max-height: 60vh; overflow-y: auto; }
.picker-item { padding: 28rpx 32rpx; border-bottom: 1rpx solid #f5f5f5; transition: background 0.2s; }
.picker-item:active { background: #f8f8f8; }
.picker-name { font-size: 30rpx; color: #333; display: block; font-weight: 500; }
.picker-addr { font-size: 26rpx; color: #999; margin-top: 10rpx; display: block; }
</style>
