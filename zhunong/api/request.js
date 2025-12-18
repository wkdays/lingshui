import storage from '@/utils/storage.js'

const DEFAULT_BASE_URL = 'http://127.0.0.1:3000'
const DEFAULT_WALLET_BASE_URL = 'http://127.0.0.1:8080'

export function getApiBaseUrl() {
	const saved = uni.getStorageSync('tg_api_base_url')
	return saved || DEFAULT_BASE_URL
}

export function getWalletBaseUrl() {
	const saved = uni.getStorageSync('zl_wallet_base_url')
	return saved || DEFAULT_WALLET_BASE_URL
}

export default function request({ url, method = 'GET', data } = {}) {
	const token = storage.getToken() || storage.getZonglianToken()
	return new Promise(resolve => {
		uni.request({
			url: getApiBaseUrl() + url,
			method,
			data,
			header: token ? { Authorization: `Bearer ${token}` } : {},
			success: (res) => {
				const body = res.data || {}
				if (body && typeof body === 'object' && Object.prototype.hasOwnProperty.call(body, 'code')) {
					resolve(body)
					return
				}
				resolve({
					code: res.statusCode || -1,
					message: body?.message || '请求失败',
					data: body?.data
				})
			},
			fail: (err) => {
				resolve({ code: -1, message: err?.errMsg || '网络错误' })
			}
		})
	})
}

export function requestWallet({ url, method = 'GET', data } = {}) {
	const token = storage.getZonglianToken()
	return new Promise(resolve => {
		uni.request({
			url: getWalletBaseUrl() + '/api' + url,
			method,
			data,
			header: token ? { Authorization: `Bearer ${token}` } : {},
			success: (res) => {
				const body = res.data || {}
				if (body && typeof body === 'object' && Object.prototype.hasOwnProperty.call(body, 'code')) {
					resolve(body)
					return
				}
				resolve({
					code: res.statusCode || -1,
					message: body?.message || '请求失败',
					data: body?.data
				})
			},
			fail: (err) => {
				resolve({ code: -1, message: err?.errMsg || '网络错误' })
			}
		})
	})
}

