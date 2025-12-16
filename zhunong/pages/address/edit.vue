<template>
	<view class="container">
		<view class="form">
			<view class="form-item">
				<text class="label">收货人</text>
				<input type="text" v-model="form.name" placeholder="请输入收货人姓名" />
			</view>
			<view class="form-item">
				<text class="label">手机号</text>
				<input type="text" v-model="form.phone" placeholder="请输入手机号" maxlength="11" />
			</view>
			<view class="form-item" @click="chooseRegion">
				<text class="label">所在地区</text>
				<text class="region" v-if="form.province">{{form.province}} {{form.city}} {{form.district}}</text>
				<text class="placeholder" v-else>请选择省市区</text>
				<text class="arrow">></text>
			</view>
			<view class="form-item">
				<text class="label">详细地址</text>
				<input type="text" v-model="form.detail" placeholder="请输入详细地址" />
			</view>
			<view class="form-item switch-item">
				<text class="label">设为默认地址</text>
				<switch :checked="form.isDefault" @change="form.isDefault = $event.detail.value" color="#111111" />
			</view>
		</view>
		
		<button class="save-btn" @click="saveAddress">保存</button>
	</view>
</template>

<script>
import api from '@/api/index.js'

export default {
	data() {
		return {
			addressId: '',
			form: { name: '', phone: '', province: '', city: '', district: '', detail: '', isDefault: false }
		}
	},
	onLoad(options) {
		this.addressId = options.id || ''
		if (this.addressId) this.loadAddress()
	},
	methods: {
		async loadAddress() {
			const res = await api.getAddresses()
			const addr = res.data.find(a => a.id == this.addressId)
			if (addr) this.form = { ...addr }
		},
		chooseRegion() {
			uni.chooseLocation({
				success: () => {},
				fail: () => {
					this.form.province = '广东省'
					this.form.city = '深圳市'
					this.form.district = '南山区'
				}
			})
		},
		async saveAddress() {
			if (!this.form.name) return uni.showToast({ title: '请输入收货人', icon: 'none' })
			if (!this.form.phone) return uni.showToast({ title: '请输入手机号', icon: 'none' })
			if (!this.form.province) return uni.showToast({ title: '请选择地区', icon: 'none' })
			if (!this.form.detail) return uni.showToast({ title: '请输入详细地址', icon: 'none' })
			
			await api.addAddress(this.form)
			uni.showToast({ title: '保存成功', icon: 'success' })
			setTimeout(() => uni.navigateBack(), 1500)
		}
	}
}
</script>

<style>
.container { min-height: 100vh; background: #f5f5f5; padding: 20rpx; }
.form { background: #fff; border-radius: 16rpx; }
.form-item { display: flex; align-items: center; padding: 30rpx 24rpx; border-bottom: 1rpx solid #f5f5f5; }
.form-item:last-child { border-bottom: none; }
.label { width: 160rpx; font-size: 28rpx; color: #333; }
.form-item input { flex: 1; font-size: 28rpx; }
.region { flex: 1; font-size: 28rpx; color: #333; }
.placeholder { flex: 1; font-size: 28rpx; color: #999; }
.arrow { font-size: 28rpx; color: #ccc; }
.switch-item { justify-content: space-between; }
.save-btn { margin-top: 60rpx; background: #111; color: #fff; border-radius: 44rpx; height: 88rpx; line-height: 88rpx; font-size: 32rpx; }
</style>
