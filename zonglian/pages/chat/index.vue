<template>
  <view class="page">
    <view class="header">
      <text class="title">消息</text>
    </view>
    <view class="chat-list">
      <view class="chat-item" v-for="item in chatList" :key="item.id">
        <view class="avatar">{{ item.avatar }}</view>
        <view class="chat-info">
          <view class="chat-top">
            <text class="chat-name">{{ item.name }}</text>
            <text class="chat-time">{{ item.time }}</text>
          </view>
          <text class="chat-msg">{{ item.lastMsg }}</text>
        </view>
        <view class="unread" v-if="item.unread">{{ item.unread }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      chatList: [
        { id: 1, avatar: '👤', name: '系统通知', lastMsg: '您的任务已审核通过', time: '刚刚', unread: 1 },
        { id: 2, avatar: '💼', name: '任务客服', lastMsg: '有问题随时联系我', time: '10:30', unread: 0 },
        { id: 3, avatar: '🏪', name: '门店经理', lastMsg: '明天9点到店签到', time: '昨天', unread: 2 },
      ]
    }
  }
}
</script>

<style>
.page {
  min-height: 100vh;
  background: #f5f7fb;
}

.header {
  background: #fff;
  padding: 30rpx 24rpx;
  border-bottom: 1rpx solid #eee;
}

.title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1f2430;
}

.chat-list {
  padding: 0 24rpx;
}

.chat-item {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 24rpx;
  margin-top: 16rpx;
  border-radius: 12rpx;
}

.avatar {
  width: 88rpx;
  height: 88rpx;
  background: #f0f2f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
}

.chat-info {
  flex: 1;
  margin-left: 20rpx;
}

.chat-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #1f2430;
}

.chat-time {
  font-size: 24rpx;
  color: #999;
}

.chat-msg {
  font-size: 26rpx;
  color: #8a94a6;
  margin-top: 8rpx;
}

.unread {
  background: #ff4d4f;
  color: #fff;
  font-size: 22rpx;
  min-width: 36rpx;
  height: 36rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10rpx;
}
</style>
