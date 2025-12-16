<template>
	<view class="container">
		<!-- 订单状态 -->
		<view class="status-area" :class="'status-bg-' + (order.status || 0)">
			<text class="status-text">{{order.statusText || ''}}</text>
			<text class="status-desc">{{getStatusDesc(order.status)}}</text>
		</view>

		<!-- 配送/自提信息 -->
		<view class="address-area" v-if="delivery.detail">
			<text class="area-icon">{{delivery.icon}}</text>
			<view class="address-info">
				<view class="address-top" v-if="delivery.name">
					<text class="name">{{delivery.name}}</text>
					<text class="phone" v-if="delivery.phone">{{delivery.phone}}</text>
				</view>
				<text class="address-detail">{{delivery.detail}}</text>
			</view>
		</view>

		<!-- 商品列表 -->
		<view class="goods-area">
			<view class="goods-item" v-for="goods in order.goods" :key="goods.goodsId || goods.id">
				<image :src="goods.image" mode="aspectFill" class="goods-img"></image>
				<view class="goods-info">
					<text class="goods-name">{{goods.name}}</text>
					<view class="goods-bottom">
						<text class="goods-price">￥{{goods.price}}</text>
						<text class="goods-count">x{{goods.count}}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 订单信息 -->
		<view class="info-area">
			<view class="info-item">
				<text class="info-label">订单编号</text>
				<text class="info-value">{{order.id || orderId}}</text>
			</view>
			<view class="info-item">
				<text class="info-label">下单时间</text>
				<text class="info-value">{{order.createTime || ''}}</text>
			</view>
			<view class="info-item" v-if="order.payTime">
				<text class="info-label">支付时间</text>
				<text class="info-value">{{order.payTime}}</text>
			</view>
			<view class="info-item">
				<text class="info-label">支付方式</text>
				<text class="info-value">余额支付</text>
			</view>
		</view>

		<!-- 金额明细 -->
		<view class="amount-area">
			<view class="amount-item">
				<text>商品金额</text>
				<text>￥{{Number(order.totalPrice || 0).toFixed(2)}}</text>
			</view>
			<view class="amount-item">
				<text>配送费</text>
				<text>￥0.00</text>
			</view>
			<view class="amount-item total">
				<text>实付金额</text>
				<text class="total-price">￥{{Number(order.totalPrice || 0).toFixed(2)}}</text>
			</view>
		</view>

		<!-- 底部操作 -->
		<view class="bottom-bar" v-if="order.status === 1">
			<button class="cancel-btn" @click="cancelOrder">取消订单</button>
			<button class="pay-btn" @click="payOrder">立即支付</button>
		</view>
	</view>
</template>

<script>
import api from '@/api/index.js'
import storage from '@/utils/storage.js'

export default {
	data() {
		return {
			orderId: '',
			order: { goods: [] },
			delivery: { icon: '', name: '', phone: '', detail: '' }
		}
	},
	onLoad(options) {
		this.orderId = options.id
		this.loadOrder().then(() => {
			if (options.pay === '1') setTimeout(() => this.payOrder(), 500)
		})
	},
	methods: {
		async loadOrder() {
			const res = await api.getOrderDetail(this.orderId)
			this.order = res.data || { goods: [] }
			this.delivery = await this.buildDelivery(this.order)
		},
		async buildDelivery(order) {
			const info = order.deliveryInfo || {}
			const type = Number(order.deliveryType || 3)
			if (type === 1 && info.pickup) {
				return {
					icon: '自提',
					name: info.pickup.name || '',
					phone: '',
					detail: [info.pickup.address, info.pickup.time].filter(Boolean).join(' · ')
				}
			}
			if (type === 2 && info.station) {
				return {
					icon: '驿站',
					name: info.station.name || '',
					phone: '',
					detail: [info.station.address, info.station.time].filter(Boolean).join(' · ')
				}
			}
			if (type === 3 && info.address) {
				const a = info.address
				return {
					icon: '地址',
					name: a.name || '',
					phone: a.phone || '',
					detail: `${a.province || ''}${a.city || ''}${a.district || ''}${a.detail || ''}`
				}
			}

			// 兜底：本地默认地址
			const addrRes = await api.getAddresses()
			const addr = (addrRes.data || []).find(a => a.isDefault) || (addrRes.data || [])[0] || {}
			return {
				icon: '地址',
				name: addr.name || '',
				phone: addr.phone || '',
				detail: `${addr.province || ''}${addr.city || ''}${addr.district || ''}${addr.detail || ''}`
			}
		},
		getStatusDesc(status) {
			const descMap = {
				1: '请尽快完成支付',
				2: '商家正在备货中',
				3: '等待收货',
				5: '感谢您的购买',
				6: '订单已取消'
			}
			return descMap[status] || ''
		},
		async cancelOrder() {
			uni.showModal({
				title: '提示',
				content: '确定取消该订单吗？',
				success: async (res) => {
					if (res.confirm) {
						await api.cancelOrder(this.orderId)
						uni.showToast({ title: '已取消', icon: 'success' })
						uni.navigateBack()
					}
				}
			})
		},
		async payOrder() {
			if (!storage.getToken()) {
				uni.showToast({ title: '请先登录', icon: 'none' })
				uni.navigateTo({ url: '/pages/login/login' })
				return
			}

			const balRes = await api.getBalance()
			const balance = balRes.code === 0 ? Number(balRes.data.balance) : storage.getBalance()
			const need = Number(this.order.totalPrice || 0)

			if (balance < need) {
				uni.showModal({
					title: '余额不足',
					content: '当前余额不足，是否前往充值？',
					success: (res) => {
						if (res.confirm) {
							uni.navigateTo({ url: '/pages/balance/balance' })
						}
					}
				})
				return
			}

			uni.showModal({
				title: '确认支付',
				content: `使用余额支付 ￥${need.toFixed(2)}`,
				success: async (res) => {
					if (res.confirm) {
						const payRes = await api.payOrder({ orderId: this.orderId, payType: 'balance' })
						if (payRes.code !== 0) {
							uni.showToast({ title: payRes.message || '支付失败', icon: 'none' })
							return
						}
						uni.navigateTo({ url: '/pages/order/result?orderId=' + this.orderId })
					}
				}
			})
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: #f5f5f5;
	padding-bottom: 120rpx;
}
.status-area {
	padding: 40rpx 30rpx;
	background: #111;
}
.status-bg-1 { background: linear-gradient(135deg, #FF9800, #FFB74D); }
.status-bg-2 { background: linear-gradient(135deg, #111, #333); }
.status-bg-3 { background: linear-gradient(135deg, #4CAF50, #81C784); }
.status-bg-5 { background: linear-gradient(135deg, #9E9E9E, #BDBDBD); }
.status-bg-6 { background: linear-gradient(135deg, #9E9E9E, #BDBDBD); }
.status-text {
	font-size: 36rpx;
	font-weight: bold;
	color: #fff;
	display: block;
}
.status-desc {
	font-size: 26rpx;
	color: rgba(255,255,255,0.8);
	margin-top: 12rpx;
	display: block;
}
.address-area {
	display: flex;
	background: #fff;
	padding: 24rpx;
	margin: 20rpx;
	border-radius: 12rpx;
}
.area-icon {
	font-size: 26rpx;
	font-weight: 800;
	color: #111;
	background: #f3f3f3;
	border-radius: 14rpx;
	padding: 12rpx 14rpx;
	height: 52rpx;
	line-height: 52rpx;
	margin-right: 16rpx;
}
.address-info {
	flex: 1;
}
.address-top {
	margin-bottom: 12rpx;
}
.name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-right: 20rpx;
}
.phone {
	font-size: 28rpx;
	color: #666;
}
.address-detail {
	font-size: 26rpx;
	color: #666;
	line-height: 1.5;
}
.goods-area {
	background: #fff;
	margin: 0 20rpx;
	border-radius: 12rpx;
	padding: 20rpx;
}
.goods-item {
	display: flex;
	padding: 16rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
}
.goods-item:last-child {
	border-bottom: none;
}
.goods-img {
	width: 140rpx;
	height: 140rpx;
	border-radius: 8rpx;
	background: #eee;
}
.goods-info {
	flex: 1;
	margin-left: 20rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.goods-name {
	font-size: 26rpx;
	color: #333;
}
.goods-bottom {
	display: flex;
	justify-content: space-between;
}
.goods-price {
	font-size: 28rpx;
	color: #111;
	font-weight: 800;
}
.goods-count {
	font-size: 26rpx;
	color: #999;
}
.info-area {
	background: #fff;
	margin: 20rpx;
	border-radius: 12rpx;
	padding: 20rpx;
}
.info-item {
	display: flex;
	justify-content: space-between;
	padding: 16rpx 0;
}
.info-label {
	font-size: 26rpx;
	color: #999;
}
.info-value {
	font-size: 26rpx;
	color: #333;
}
.amount-area {
	background: #fff;
	margin: 0 20rpx;
	border-radius: 12rpx;
	padding: 20rpx;
}
.amount-item {
	display: flex;
	justify-content: space-between;
	padding: 12rpx 0;
	font-size: 26rpx;
	color: #666;
}
.amount-item.total {
	border-top: 1rpx solid #f5f5f5;
	margin-top: 12rpx;
	padding-top: 20rpx;
}
.total-price {
	font-size: 32rpx;
	color: #111;
	font-weight: bold;
}
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	padding: 20rpx;
	padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	background: #fff;
	box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.08);
}
.cancel-btn {
	flex: 1;
	height: 80rpx;
	line-height: 80rpx;
	background: #fff;
	border: 1rpx solid #ddd;
	color: #666;
	border-radius: 40rpx;
	margin-right: 20rpx;
	font-size: 28rpx;
}
.pay-btn {
	flex: 1;
	height: 80rpx;
	line-height: 80rpx;
	background: #111;
	color: #fff;
	border-radius: 40rpx;
	font-size: 28rpx;
}
</style>
