<template>
	<view class="container">
		<view class="notice-card" v-if="notice">
			<!-- 公告头部 -->
			<view class="notice-header">
				<text class="notice-tag">{{getTagText(notice.type)}}</text>
				<text class="notice-time">发布时间：{{notice.time}}</text>
			</view>
			
			<!-- 公告标题 -->
			<text class="notice-title">{{notice.title}}</text>
			
			<!-- 公告内容 -->
			<view class="notice-content">
				<text class="content-text">{{notice.content}}</text>
			</view>
		</view>
		
		<!-- 加载中 -->
		<view class="loading" v-else>
			<text class="loading-text">加载中...</text>
		</view>
	</view>
</template>

<script>
import { homeApi } from '@/api/mock.js'

export default {
	data() {
		return {
			noticeId: null,
			notice: null
		}
	},
	onLoad(options) {
		this.noticeId = parseInt(options.id)
		this.loadNoticeDetail()
	},
	methods: {
		async loadNoticeDetail() {
			const res = await homeApi.getNotices()
			if (res.code === 0) {
				this.notice = res.data.find(n => n.id === this.noticeId)
				if (this.notice) {
					uni.setNavigationBarTitle({ title: '公告详情' })
				}
			}
		},
		getTagText(type) {
			const tags = {
				'activity': '活动',
				'notice': '通知',
				'system': '系统'
			}
			return tags[type] || '公告'
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

.notice-card {
	background: #fff;
	border-radius: 16rpx;
	padding: 32rpx;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}

.notice-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
	padding-bottom: 24rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.notice-tag {
	background: linear-gradient(135deg, #10B981 0%, #059669 100%);
	color: #fff;
	font-size: 24rpx;
	padding: 8rpx 20rpx;
	border-radius: 8rpx;
}

.notice-time {
	font-size: 24rpx;
	color: #999;
}

.notice-title {
	font-size: 36rpx;
	color: #333;
	font-weight: 600;
	display: block;
	margin-bottom: 32rpx;
	line-height: 1.5;
}

.notice-content {
	padding: 20rpx 0;
}

.content-text {
	font-size: 30rpx;
	color: #666;
	line-height: 1.8;
	display: block;
}

.loading {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 100rpx 0;
}

.loading-text {
	font-size: 28rpx;
	color: #999;
}
</style>
