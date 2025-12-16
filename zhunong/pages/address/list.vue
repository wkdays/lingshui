<template>
	<view class="container">
		<view class="address-list">
			<view class="address-item" v-for="item in addresses" :key="item.id" @click="selectAddress(item)">
				<view class="addr-content">
					<view class="addr-top">
						<text class="addr-name">{{item.name}}</text>
						<text class="addr-phone">{{item.phone}}</text>
						<view class="default-tag" v-if="item.isDefault">默认</view>
					</view>
					<text class="addr-detail">{{item.province}}{{item.city}}{{item.district}}{{item.detail}}</text>
				</view>
				<view class="addr-actions">
					<text class="action-btn" @click.stop="editAddress(item)">编辑</text>
					<text class="action-btn" @click.stop="deleteAddress(item)">删除</text>
				</view>
			</view>
		</view>
		
		<view class="empty" v-if="!addresses.length">
			<text class="empty-icon">📍</text>
			<text class="empty-text">暂无收货地址</text>
		</view>
		
		<view class="bottom-bar">
			<button class="add-btn" @click="addAddress">+ 新增收货地址</button>
		</view>
	</view>
</template>

<script>
import api from '@/api/index.js'

export default {
	data() {
		return {
			isSelect: false,
			addresses: []
		}
	},
	onLoad(options) {
		this.isSelect = options.select === '1'
		this.loadAddresses()
	},
	onShow() {
		this.loadAddresses()
	},
	methods: {
		async loadAddresses() {
			const res = await api.getAddresses()
			this.addresses = res.data
		},
		selectAddress(item) {
			if (this.isSelect) {
				uni.setStorageSync('selectedAddress', item)
				uni.navigateBack()
			}
		},
		addAddress() {
			uni.navigateTo({ url: '/pages/address/edit' })
		},
		editAddress(item) {
			uni.navigateTo({ url: '/pages/address/edit?id=' + item.id })
		},
		deleteAddress(item) {
			uni.showModal({
				title: '提示',
				content: '确定删除该地址吗？',
				success: (res) => {
					if (res.confirm) {
						this.addresses = this.addresses.filter(a => a.id !== item.id)
						if (this.addresses.length && !this.addresses.some(a => a.isDefault)) {
							this.addresses[0].isDefault = true
						}
						uni.setStorageSync('tg_addresses', JSON.stringify(this.addresses))
						uni.showToast({ title: '已删除', icon: 'success' })
					}
				}
			})
		}
	}
}
</script>

<style>
.container { min-height: 100vh; background: #f5f5f5; padding-bottom: 120rpx; }
.address-list { padding: 20rpx; }
.address-item { background: #fff; padding: 24rpx; border-radius: 12rpx; margin-bottom: 20rpx; }
.addr-content { margin-bottom: 20rpx; }
.addr-top { display: flex; align-items: center; margin-bottom: 12rpx; }
.addr-name { font-size: 30rpx; font-weight: bold; color: #333; margin-right: 16rpx; }
.addr-phone { font-size: 28rpx; color: #666; }
.default-tag { background: #111; color: #fff; font-size: 22rpx; padding: 4rpx 12rpx; border-radius: 4rpx; margin-left: 16rpx; }
.addr-detail { font-size: 26rpx; color: #666; line-height: 1.5; }
.addr-actions { display: flex; justify-content: flex-end; border-top: 1rpx solid #f5f5f5; padding-top: 20rpx; }
.action-btn { font-size: 26rpx; color: #666; margin-left: 40rpx; }
.empty { display: flex; flex-direction: column; align-items: center; padding-top: 200rpx; }
.empty-icon { font-size: 120rpx; }
.empty-text { font-size: 28rpx; color: #999; margin-top: 20rpx; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; padding: 20rpx; background: #fff; }
.add-btn { background: #111; color: #fff; border-radius: 44rpx; height: 88rpx; line-height: 88rpx; font-size: 30rpx; }
</style>
