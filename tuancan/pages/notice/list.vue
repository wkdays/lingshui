<template>
	<view class="container">
		<!-- 公告列表 -->
		<view class="notice-list">
			<view class="notice-item" v-for="notice in notices" :key="notice.id" @click="goDetail(notice)">
				<view class="notice-header">
					<text class="notice-tag">{{getTagText(notice.type)}}</text>
					<text class="notice-time">{{notice.time}}</text>
				</view>
				<text class="notice-title">{{notice.title}}</text>
				<text class="notice-preview">{{notice.content}}</text>
			</view>
		</view>
		
		<!-- 空状态 -->
		<view class="empty" v-if="notices.length === 0">
			<text class="empty-text">暂无公告</text>
		</view>
	</view>
</template>

<script>
import { homeApi } from '@/api/mock.js'

export default {
	data() {
		return {
			notices: []
		}
	},
	onLoad() {
		this.loadNotices()
	},
	methods: {
		async loadNotices() {
			const res = await homeApi.getNotices()
			if (res.code === 0) {
				this.notices = res.data
			}
		},
		getTagText(type) {
			const tags = {
				'activity': '活动',
				'notice': '通知',
				'system': '系统'
			}
			return tags[type] || '公告'
		},
		goDetail(notice) {
			uni.navigateTo({
				url: `/pages/notice/detail?id=${notice.id}`
			})
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: #f5f5f5;
	padding: 20rpx;
}

.notice-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.notice-item {
	background: #fff;
	border-radius: 16rpx;
	padding: 28rpx;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}

.notice-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.notice-tag {
	background: linear-gradient(135deg, #10B981 0%, #059669 100%);
	color: #fff;
	font-size: 22rpx;
	padding: 6rpx 16rpx;
	border-radius: 6rpx;
}

.notice-time {
	font-size: 24rpx;
	color: #999;
}

.notice-title {
	font-size: 30rpx;
	color: #333;
	font-weight: 600;
	display: block;
	margin-bottom: 12rpx;
	line-height: 1.4;
}

.notice-preview {
	font-size: 26rpx;
	color: #666;
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.empty {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 100rpx 0;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}
</style>
