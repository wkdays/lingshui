/**
 * 全局状态管理
 * 管理用户信息、余额、购物车等共享状态
 */

import storage from '@/utils/storage.js'

// 创建一个简单的响应式状态管理
const state = {
    // 用户信息
    userInfo: null,
    // 是否已登录
    isLogin: false,
    // 共享余额（从本地存储读取）
    balance: 0,
    // 购物车
    cart: [],
    // 未读消息数
    unreadCount: 0
}

// 初始化状态
function initState() {
    const token = storage.getToken()
    state.isLogin = !!token

    if (state.isLogin) {
        state.userInfo = storage.getUserInfo()
    }

    // 余额始终从共享存储读取
    state.balance = storage.getBalance()
    state.cart = storage.getCart()
}

// 状态操作方法
const actions = {
    // 登录
    login(userInfo, token) {
        storage.setToken(token)
        storage.setUserInfo(userInfo)
        state.userInfo = userInfo
        state.isLogin = true
        state.balance = storage.getBalance()
    },

    // 退出登录
    logout() {
        storage.clearAll()
        state.userInfo = null
        state.isLogin = false
        state.cart = []
        // 余额保留，不清除
    },

    // 更新用户信息
    updateUserInfo(info) {
        state.userInfo = { ...state.userInfo, ...info }
        storage.setUserInfo(state.userInfo)
    },

    // 获取最新余额
    getBalance() {
        state.balance = storage.getBalance()
        return state.balance
    },

    // 充值
    recharge(amount) {
        const result = storage.rechargeBalance(amount)
        if (result.success) {
            state.balance = result.balance
            // 添加交易记录
            storage.addTransaction({
                type: 'recharge',
                title: '余额充值',
                amount: amount,
                orderNo: ''
            })
        }
        return result
    },

    // 消费扣款
    consume(amount, orderNo) {
        const result = storage.deductBalance(amount)
        if (result.success) {
            state.balance = result.balance
            // 添加交易记录
            storage.addTransaction({
                type: 'consume',
                title: '购买商品',
                amount: -amount,
                orderNo: orderNo
            })
        }
        return result
    },

    // 获取交易记录
    getTransactions() {
        return storage.getTransactions()
    },

    // 购物车操作
    addToCart(goods) {
        const existIndex = state.cart.findIndex(
            item => item.goodsId === goods.goodsId && item.spec === goods.spec
        )

        if (existIndex > -1) {
            state.cart[existIndex].count += goods.count || 1
        } else {
            state.cart.push({
                id: Date.now(),
                ...goods,
                count: goods.count || 1,
                selected: true
            })
        }
        storage.setCart(state.cart)
    },

    updateCartItem(id, data) {
        const index = state.cart.findIndex(item => item.id === id)
        if (index > -1) {
            state.cart[index] = { ...state.cart[index], ...data }
            storage.setCart(state.cart)
        }
    },

    removeCartItem(id) {
        state.cart = state.cart.filter(item => item.id !== id)
        storage.setCart(state.cart)
    },

    clearSelectedCart() {
        state.cart = state.cart.filter(item => !item.selected)
        storage.setCart(state.cart)
    },

    getCart() {
        state.cart = storage.getCart()
        return state.cart
    },

    // 设置未读消息数
    setUnreadCount(count) {
        state.unreadCount = count
    }
}

// 初始化
initState()

export default {
    state,
    ...actions
}
