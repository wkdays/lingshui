<template>
	<view class="container">
		<view class="message-list">
			<view class="message-item" :class="{unread: !item.read}" v-for="item in messages" :key="item.id">
				<view class="msg-icon">🔔</view>
				<view class="msg-content">
					<view class="msg-header">
						<text class="msg-title">{{item.title}}</text>
						<text class="msg-time">{{item.time}}</text>
					</view>
					<text class="msg-text">{{item.content}}</text>
				</view>
				<view class="unread-dot" v-if="!item.read"></view>
			</view>
		</view>
		
		<view class="empty" v-if="!messages.length">
			<text class="empty-icon">🔔</text>
			<text class="empty-text">暂无消息</text>
		</view>
	</view>
</template>

<script>
import api from '@/api/index.js'

export default {
	data() {
		return {
			messages: []
		}
	},
	onLoad() {
		this.loadMessages()
	},
	methods: {
		async loadMessages() {
			const res = await api.getMessages()
			this.messages = res.data
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
}
.message-item { 
	display: flex; 
	align-items: flex-start; 
	background: #fff; 
	padding: 28rpx; 
	border-radius: 16rpx; 
	margin-bottom: 20rpx; 
	position: relative;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
	transition: transform 0.2s;
}
.message-item:active {
	transform: scale(0.99);
}
.message-item.unread { 
	background: linear-gradient(135deg, #FFF9F5, #fff);
	border-left: 6rpx solid #111;
}
.msg-icon { 
	font-size: 52rpx; 
	margin-right: 20rpx;
	width: 70rpx;
	height: 70rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f3f3f3;
	border-radius: 16rpx;
}
.msg-content { 
	flex: 1; 
}
.msg-header { 
	display: flex; 
	justify-content: space-between; 
	align-items: center; 
	margin-bottom: 14rpx; 
}
.msg-title { 
	font-size: 30rpx; 
	font-weight: bold; 
	color: #333; 
}
.msg-time { 
	font-size: 24rpx; 
	color: #999;
	background: #f5f5f5;
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
}
.msg-text { 
	font-size: 26rpx; 
	color: #666; 
	line-height: 1.6; 
}
.unread-dot { 
	position: absolute; 
	top: 28rpx; 
	right: 28rpx; 
	width: 18rpx; 
	height: 18rpx; 
	background: #111; 
	border-radius: 50%;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.18);
}
.empty { 
	display: flex; 
	flex-direction: column; 
	align-items: center; 
	padding-top: 200rpx; 
}
.empty-icon { 
	font-size: 140rpx;
	opacity: 0.5;
}
.empty-text { 
	font-size: 30rpx; 
	color: #999; 
	margin-top: 24rpx; 
}
</style>
