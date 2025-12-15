<script>
	import { getToken, getUser } from '@/utils/storage.js'
	import store from '@/store/index.js'
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 初始化用户状态
			const token = getToken()
			if (token) {
				store.setToken(token)
				const user = getUser()
				if (user) {
					store.setUserInfo(user)
				}
			}
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
	/* 全局公共样式 */
	page {
		background-color: #f5f5f5;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	}
	
	/* 清除默认样式 */
	view, text, image, input, button, scroll-view {
		box-sizing: border-box;
	}
	
	/* 主题色变量 */
	:root {
		--primary-color: #4CD964;
		--primary-gradient: linear-gradient(135deg, #4CD964 0%, #5AC8FA 100%);
		--danger-color: #FF3B30;
		--warning-color: #FF9500;
		--text-color: #333333;
		--text-secondary: #666666;
		--text-placeholder: #999999;
		--border-color: #E5E5E5;
		--bg-color: #F5F5F5;
	}
	
	/* 安全区域适配 */
	.safe-bottom {
		padding-bottom: env(safe-area-inset-bottom);
	}
	
	/* 文字省略 */
	.ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.ellipsis-2 {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
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
	
	.flex-column {
		display: flex;
		flex-direction: column;
	}
	
	/* 按钮禁用状态 */
	.btn-disabled {
		opacity: 0.5;
		pointer-events: none;
	}
</style>
