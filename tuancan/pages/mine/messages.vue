<template>
	<view class="container">
		<!-- 消息列表 -->
		<scroll-view class="message-list" scroll-y>
			<view class="empty" v-if="messageList.length === 0">
				<text class="empty-text">暂无消息</text>
			</view>
			<view 
				class="message-item" 
				:class="{unread: !item.read}" 
				v-for="item in messageList" 
				:key="item.id"
				@click="readMessage(item)">
				<view class="message-icon">
					<text v-if="item.type === 'order'">📦</text>
					<text v-else>🔔</text>
					<view class="dot" v-if="!item.read"></view>
				</view>
				<view class="message-content">
					<view class="message-header">
						<text class="message-title">{{item.title}}</text>
						<text class="message-time">{{formatTime(item.time)}}</text>
					</view>
					<text class="message-text">{{item.content}}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { messageApi } from '@/api/mock.js'

export default {
	data() {
		return {
			messageList: []
		}
	},
	onLoad() {
		this.loadMessages()
	},
	methods: {
		async loadMessages() {
			const res = await messageApi.getMessages()
			if (res.code === 0) {
				this.messageList = res.data
			}
		},
		async readMessage(item) {
			if (!item.read) {
				await messageApi.markAsRead(item.id)
				item.read = true
			}
			// 如果是订单消息，可以跳转到订单详情
			if (item.type === 'order') {
				uni.showToast({ title: '查看订单详情', icon: 'none' })
			}
		},
		formatTime(time) {
			if (!time) return ''
			const date = new Date(time)
			const now = new Date()
			const diff = now - date
			if (diff < 60000) return '刚刚'
			if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
			if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
			return time.split(' ')[0]
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: #f5f5f5;
}

.message-list {
	padding: 20rpx;
	height: 100vh;
}

.empty {
	text-align: center;
	padding: 100rpx 0;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}

.message-item {
	display: flex;
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 16rpx;
}

.message-item.unread {
	background: #f0fff4;
}

.message-icon {
	width: 80rpx;
	height: 80rpx;
	background: #f5f5f5;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	margin-right: 20rpx;
	position: relative;
}

.dot {
	position: absolute;
	top: 0;
	right: 0;
	width: 16rpx;
	height: 16rpx;
	background: #FF3B30;
	border-radius: 50%;
}

.message-content {
	flex: 1;
}

.message-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10rpx;
}

.message-title {
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
}

.message-time {
	font-size: 24rpx;
	color: #999;
}

.message-text {
	font-size: 26rpx;
	color: #666;
	line-height: 1.5;
}
</style>
