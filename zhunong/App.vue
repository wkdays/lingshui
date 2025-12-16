<script>
	export default {
		onLaunch: function() {
			console.log('App Launch - 社区团购')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* 全局样式 */
	page {
		background-color: #f5f5f5;
		font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
		font-size: 28rpx;
		color: #333;
		line-height: 1.5;
	}
	
	view, text {
		box-sizing: border-box;
	}
	
	button {
		margin: 0;
		padding: 0;
		border: none;
		background: none;
		line-height: inherit;
	}
	
	button::after {
		border: none;
	}
	
	image {
		display: block;
		width: 100%;
		height: 100%;
	}
	
	/* 主题色 */
	.text-primary {
		color: #111;
	}
	
	.bg-primary {
		background-color: #111;
	}
	
	.bg-primary-gradient {
		background: linear-gradient(135deg, #111, #333);
	}
	
	.text-danger {
		color: #FF4444;
	}
	
	.text-success {
		color: #4CAF50;
	}
	
	.text-warning {
		color: #FF9800;
	}
	
	.text-muted {
		color: #999;
	}
	
	/* 安全区域 */
	.safe-area-bottom {
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	
	/* 通用卡片样式 */
	.card {
		background: #fff;
		border-radius: 20rpx;
		margin: 20rpx;
		padding: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
	}
	
	/* 单行省略 */
	.ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	/* 多行省略 */
	.ellipsis-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	
	/* Flex布局 */
	.flex {
		display: flex;
	}
	
	.flex-center {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.flex-between {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.flex-1 {
		flex: 1;
	}
	
	/* 按钮样式 */
	.btn-primary {
		background: linear-gradient(135deg, #111, #333);
		color: #fff;
		border-radius: 44rpx;
		padding: 24rpx 48rpx;
		font-size: 30rpx;
		font-weight: 500;
		box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.18);
		text-align: center;
	}
	
	.btn-primary:active {
		transform: scale(0.98);
		opacity: 0.9;
	}
	
	.btn-outline {
		background: #fff;
		color: #111;
		border: 2rpx solid #111;
		border-radius: 44rpx;
		padding: 22rpx 48rpx;
		font-size: 30rpx;
		font-weight: 500;
		text-align: center;
	}
	
	.btn-outline:active {
		background: #f5f5f5;
	}
	
	/* 阴影 */
	.shadow-sm {
		box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
	}
	
	.shadow {
		box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
	}
	
	.shadow-lg {
		box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.1);
	}
	
	/* 圆角 */
	.rounded {
		border-radius: 12rpx;
	}
	
	.rounded-lg {
		border-radius: 20rpx;
	}
	
	.rounded-full {
		border-radius: 50%;
	}
	
	/* 间距 */
	.p-20 {
		padding: 20rpx;
	}
	
	.m-20 {
		margin: 20rpx;
	}
	
	.mt-20 {
		margin-top: 20rpx;
	}
	
	.mb-20 {
		margin-bottom: 20rpx;
	}
	
	/* 动画过渡 */
	.transition {
		transition: all 0.2s ease;
	}
	
	/* 点击效果 */
	.clickable:active {
		opacity: 0.8;
		transform: scale(0.98);
	}
</style>
