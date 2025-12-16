/**
 * 本地存储工具类
 * 用于持久化用户数据，模拟四个小程序共享余额
 */

const STORAGE_KEYS = {
    TOKEN: 'tg_token',
    USER_INFO: 'tg_user_info',
    BALANCE: 'tg_shared_balance',      // 共享余额key
    TRANSACTIONS: 'tg_transactions',   // 交易记录
    CART: 'tg_cart'
}

// 默认余额
const DEFAULT_BALANCE = 568.50

export default {
    // 获取共享余额
    getBalance() {
        const balance = uni.getStorageSync(STORAGE_KEYS.BALANCE)
        if (balance === '' || balance === null || balance === undefined) {
            // 首次使用，初始化默认余额
            this.setBalance(DEFAULT_BALANCE)
            return DEFAULT_BALANCE
        }
        return Number(balance)
    },

    // 设置余额
    setBalance(balance) {
        uni.setStorageSync(STORAGE_KEYS.BALANCE, balance)
    },

    // 扣减余额
    deductBalance(amount) {
        const current = this.getBalance()
        if (current < amount) {
            return { success: false, message: '余额不足' }
        }
        const newBalance = Number((current - amount).toFixed(2))
        this.setBalance(newBalance)
        return { success: true, balance: newBalance }
    },

    // 充值余额
    rechargeBalance(amount) {
        const current = this.getBalance()
        const newBalance = Number((current + amount).toFixed(2))
        this.setBalance(newBalance)
        return { success: true, balance: newBalance }
    },

    // 获取交易记录
    getTransactions() {
        const data = uni.getStorageSync(STORAGE_KEYS.TRANSACTIONS)
        return data ? JSON.parse(data) : []
    },

    // 添加交易记录
    addTransaction(record) {
        const list = this.getTransactions()
        const newRecord = {
            id: Date.now(),
            time: this.formatTime(new Date()),
            ...record
        }
        list.unshift(newRecord)
        uni.setStorageSync(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(list.slice(0, 100)))
        return newRecord
    },

    // Token相关
    getToken() {
        return uni.getStorageSync(STORAGE_KEYS.TOKEN)
    },
    setToken(token) {
        uni.setStorageSync(STORAGE_KEYS.TOKEN, token)
    },
    removeToken() {
        uni.removeStorageSync(STORAGE_KEYS.TOKEN)
    },

    // 用户信息
    getUserInfo() {
        const data = uni.getStorageSync(STORAGE_KEYS.USER_INFO)
        if (data) {
            const user = JSON.parse(data)
            // 余额从共享存储读取
            user.balance = this.getBalance()
            return user
        }
        return null
    },
    setUserInfo(info) {
        // 余额单独存储到共享key
        if (info.balance !== undefined) {
            this.setBalance(info.balance)
        }
        uni.setStorageSync(STORAGE_KEYS.USER_INFO, JSON.stringify(info))
    },
    removeUserInfo() {
        uni.removeStorageSync(STORAGE_KEYS.USER_INFO)
    },

    // 购物车
    getCart() {
        const data = uni.getStorageSync(STORAGE_KEYS.CART)
        return data ? JSON.parse(data) : []
    },
    setCart(cart) {
        uni.setStorageSync(STORAGE_KEYS.CART, JSON.stringify(cart))
    },

    // 清除所有数据（退出登录时调用）
    clearAll() {
        this.removeToken()
        this.removeUserInfo()
        uni.removeStorageSync(STORAGE_KEYS.CART)
        // 注意：余额和交易记录不清除，保持共享
    },

    // 格式化时间
    formatTime(date) {
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        const h = String(date.getHours()).padStart(2, '0')
        const min = String(date.getMinutes()).padStart(2, '0')
        return `${y}-${m}-${d} ${h}:${min}`
    }
}
