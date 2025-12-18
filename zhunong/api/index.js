/**
 * API接口封装
 * - 需要真实接口的模块：通过 Node+Express+MySQL 服务端请求
 * - 假数据/本地存储模块：继续使用本地 Mock 与 Storage
 */

import storage from '@/utils/storage.js'
import request, { getApiBaseUrl, requestWallet } from './request.js'

// 模拟网络延迟
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

const normalizeStaticUrl = url =>
    typeof url === 'string' && url.startsWith('/static/') ? getApiBaseUrl() + url : url

// 生成订单号
const generateOrderNo = () => 'TG' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase()

// Mock静态数据
const mockData = {
    // 轮播图
    banners: [
        { id: 1, image: '/static/banner1.png', title: '新人专享优惠', link: '' },
        { id: 2, image: '/static/banner2.png', title: '限时特价', link: '' },
        { id: 3, image: '/static/banner3.png', title: '满减活动', link: '' }
    ],

    // 公告
    notices: [
        { id: 1, title: '双12活动火热进行中，全场满100减20！', time: '2025-12-11' },
        { id: 2, title: '新用户首单立减10元', time: '2025-12-10' }
    ],

    // 商品分类
    categories: [
        { id: 1, name: '生鲜果蔬', icon: '/static/cate1.png' },
        { id: 2, name: '肉禽蛋品', icon: '/static/cate2.png' },
        { id: 3, name: '米面粮油', icon: '/static/cate3.png' },
        { id: 4, name: '休闲零食', icon: '/static/cate4.png' },
        { id: 5, name: '酒水饮料', icon: '/static/cate5.png' },
        { id: 6, name: '日用百货', icon: '/static/cate6.png' },
        { id: 7, name: '特价专区', icon: '/static/cate7.png' },
        { id: 8, name: '全部分类', icon: '/static/cate8.png' }
    ],

    // 商家列表
    shops: [
        { id: 1, name: '鲜果坊', logo: '/static/shop1.png', score: 4.8, distance: '1.2km', sales: 2680, tags: ['水果', '生鲜'] },
        { id: 2, name: '肉联厂直营店', logo: '/static/shop2.png', score: 4.9, distance: '0.8km', sales: 3520, tags: ['肉类', '蛋品'] },
        { id: 3, name: '粮油批发部', logo: '/static/shop3.png', score: 4.7, distance: '2.1km', sales: 1890, tags: ['粮油', '调味'] }
    ],

    // 商品列表
    goods: [
        { id: 1, name: '新疆阿克苏冰糖心苹果', image: '/static/goods1.png', price: 29.9, originalPrice: 39.9, sales: 1280, shopId: 1, shopName: '鲜果坊', isSpecial: true, stock: 100 },
        { id: 2, name: '土鸡蛋30枚装', image: '/static/goods2.png', price: 35.0, originalPrice: 45.0, sales: 890, shopId: 2, shopName: '肉联厂直营店', isSpecial: false, stock: 50 },
        { id: 3, name: '五常大米10斤', image: '/static/goods3.png', price: 49.9, originalPrice: 59.9, sales: 2100, shopId: 3, shopName: '粮油批发部', isSpecial: true, stock: 200 },
        { id: 4, name: '新鲜猪五花肉', image: '/static/goods4.png', price: 18.8, originalPrice: 25.0, sales: 560, shopId: 2, shopName: '肉联厂直营店', isSpecial: false, stock: 30 },
        { id: 5, name: '云南沃柑5斤装', image: '/static/goods5.png', price: 25.9, originalPrice: 35.9, sales: 780, shopId: 1, shopName: '鲜果坊', isSpecial: true, stock: 80 },
        { id: 6, name: '金龙鱼花生油5L', image: '/static/goods6.png', price: 89.9, originalPrice: 109.9, sales: 450, shopId: 3, shopName: '粮油批发部', isSpecial: false, stock: 60 }
    ],

    // 消息列表
    messages: [
        { id: 1, title: '订单支付成功', content: '您的订单已支付成功', time: '2025-12-11 10:31', read: false },
        { id: 2, title: '订单已发货', content: '您的订单已发货，请注意查收', time: '2025-12-10 16:00', read: true },
        { id: 3, title: '订单已完成', content: '您的订单已完成，欢迎再次购买', time: '2025-12-09 18:00', read: true }
    ],

    // 地址列表
    addresses: [
        { id: 1, name: '张三', phone: '13888888888', province: '广东省', city: '深圳市', district: '南山区', detail: '科技园南区A栋101', isDefault: true },
        { id: 2, name: '李四', phone: '13999999999', province: '广东省', city: '深圳市', district: '福田区', detail: '华强北路100号', isDefault: false }
    ],

    // 自提点
    pickupPoints: [
        { id: 1, name: '科技园自提点', address: '南山区科技园南区B栋一楼', time: '09:00-21:00' },
        { id: 2, name: '华强北自提点', address: '福田区华强北路200号', time: '08:00-22:00' }
    ],

    // 驿站
    stations: [
        { id: 1, name: '菜鸟驿站(科技园店)', address: '南山区科技园南区C栋', time: '08:00-22:00' },
        { id: 2, name: '丰巢快递柜', address: '南山区科技园北区门口', time: '24小时' }
    ]
}

// 订单状态映射
const ORDER_STATUS = {
    1: '待支付',
    2: '待发货',
    3: '待自取',
    4: '配送中',
    5: '已完成',
    6: '已取消'
}

// 获取本地订单列表
const getLocalOrders = () => {
    const data = uni.getStorageSync('tg_orders')
    return data ? JSON.parse(data) : []
}

// 保存订单到本地
const saveLocalOrders = (orders) => {
    uni.setStorageSync('tg_orders', JSON.stringify(orders))
}

// API接口
export default {
    // ==================== 用户相关 ====================

    // 用户登录
    login(data) {
        const account = data?.account || data?.phone || ''
        const password = data?.password || ''

        return request({
            url: '/api/user/login',
            method: 'POST',
            data: { account, password }
        }).then(res => {
            if (res.code === 0 && res.data) {
                const nextData = { ...res.data, phone: res.data.account }
                nextData.avatar = normalizeStaticUrl(nextData.avatar)
                storage.setToken(res.data.token)
                storage.setUserInfo({
                    id: nextData.id,
                    nickname: nextData.nickname,
                    avatar: nextData.avatar,
                    phone: nextData.phone,
                    balance: nextData.balance
                })
                return { ...res, data: nextData }
            }
            return res
        })
    },

    // 获取用户信息
    getUserInfo() {
        return request({ url: '/api/user/profile', method: 'GET' }).then(res => {
            if (res.code === 0 && res.data) {
                const nextData = { ...res.data, phone: res.data.account }
                nextData.avatar = normalizeStaticUrl(nextData.avatar)
                storage.setUserInfo({
                    id: nextData.id,
                    nickname: nextData.nickname,
                    avatar: nextData.avatar,
                    phone: nextData.phone,
                    balance: nextData.balance
                })
                return { ...res, data: nextData }
            }
            return res
        })
    },

    // ==================== 余额相关（共享） ====================

    // 获取余额
    getBalance() {
        return requestWallet({ url: '/wallet/balance', method: 'GET' }).then(res => {
            if (res.code === 0 && res.data && typeof res.data.balance !== 'undefined') {
                storage.setBalance(res.data.balance)
            }
            return res
        })
    },

    // 余额充值
    recharge(amount) {
        return requestWallet({
            url: '/wallet/recharge',
            method: 'POST',
            data: { amount }
        }).then(res => {
            if (res.code === 0 && res.data && typeof res.data.balance !== 'undefined') {
                storage.setBalance(res.data.balance)
            }
            return res
        })
    },

    // 获取交易记录
    getTransactions() {
        // zonglian 暂未提供交易流水接口，这里先保持本地/旧接口兼容
        return request({ url: '/api/wallet/transactions', method: 'GET' }).then(res => ({
            ...res,
            data: Array.isArray(res.data) ? res.data : []
        }))
    },

    // ==================== 首页数据 ====================

    getBanners() {
        return request({ url: '/api/banner/list', method: 'GET' }).then(res => {
            const list = Array.isArray(res.data)
                ? res.data.map(item => ({
                    ...item,
                    image: normalizeStaticUrl(item.image)
                }))
                : []
            return { ...res, data: list }
        })
    },

    getNotices() {
        return request({ url: '/api/notice/list', method: 'GET' }).then(res => ({
            ...res,
            data: Array.isArray(res.data) ? res.data : []
        }))
    },

    getCategories() {
        return delay(100).then(() => ({ code: 0, data: mockData.categories }))
    },

    // ==================== 商家相关 ====================

    getShops(params) {
        return delay().then(() => ({ code: 0, data: mockData.shops }))
    },

    getShopDetail(id) {
        return delay().then(() => ({
            code: 0,
            data: mockData.shops.find(s => s.id == id) || mockData.shops[0]
        }))
    },

    // ==================== 商品相关 ====================

    getRecommendGoods() {
        return delay().then(() => ({ code: 0, data: mockData.goods }))
    },

    getGoodsList(params) {
        return delay().then(() => {
            let list = [...mockData.goods]
            if (params?.shopId) {
                list = list.filter(g => g.shopId == params.shopId)
            }
            if (params?.categoryId) {
                // 简单模拟分类筛选
            }
            if (params?.keyword) {
                const kw = String(params.keyword).trim()
                if (kw) {
                    list = list.filter(g => String(g.name || '').includes(kw))
                }
            }
            if (params?.sortType === 'sales') {
                list.sort((a, b) => (b.sales || 0) - (a.sales || 0))
            } else if (params?.sortType === 'price') {
                const asc = params?.priceAsc !== false
                list.sort((a, b) => asc ? (a.price - b.price) : (b.price - a.price))
            }
            return { code: 0, data: list }
        })
    },

    getGoodsDetail(id) {
        return delay().then(() => ({
            code: 0,
            data: mockData.goods.find(g => g.id == id) || mockData.goods[0]
        }))
    },

    getSpecialGoods() {
        return delay().then(() => ({
            code: 0,
            data: mockData.goods.filter(g => g.isSpecial)
        }))
    },

    // ==================== 购物车相关 ====================

    getCart() {
        return delay(100).then(() => ({
            code: 0,
            data: storage.getCart()
        }))
    },

    addToCart(data) {
        return delay(100).then(() => {
            const cart = storage.getCart()
            const goods = mockData.goods.find(g => g.id == data.goodsId)
            if (!goods) return { code: -1, message: '商品不存在' }

            const existIndex = cart.findIndex(item => item.goodsId == data.goodsId)
            if (existIndex > -1) {
                cart[existIndex].count += data.count || 1
            } else {
                cart.push({
                    id: Date.now(),
                    goodsId: goods.id,
                    name: goods.name,
                    image: goods.image,
                    price: goods.price,
                    count: data.count || 1,
                    selected: true,
                    shopId: goods.shopId,
                    shopName: goods.shopName
                })
            }
            storage.setCart(cart)
            return { code: 0, data: { id: Date.now() } }
        })
    },

    updateCart(data) {
        return delay(100).then(() => {
            const cart = storage.getCart()
            const index = cart.findIndex(item => item.id == data.id)
            if (index > -1) {
                cart[index] = { ...cart[index], ...data }
                storage.setCart(cart)
            }
            return { code: 0 }
        })
    },

    deleteCartItem(id) {
        return delay(100).then(() => {
            const cart = storage.getCart().filter(item => item.id != id)
            storage.setCart(cart)
            return { code: 0 }
        })
    },

    // ==================== 订单相关 ====================

    getOrders(status) {
        const qs = status ? `?status=${encodeURIComponent(status)}` : ''
        return request({ url: `/api/order/list${qs}`, method: 'GET' }).then(res => ({
            ...res,
            data: Array.isArray(res.data) ? res.data : []
        }))
    },

    getOrderDetail(id) {
        return request({ url: `/api/order/detail/${encodeURIComponent(id)}`, method: 'GET' }).then(res => ({
            ...res,
            data: res.data || null
        }))
    },

    createOrder(data) {
        return request({
            url: '/api/order/create',
            method: 'POST',
            data
        })
    },

    payOrder(data) {
        const payType = String(data?.payType || 'balance')
        const orderId = data?.orderId
        if (!orderId) {
            return Promise.resolve({ code: -1, message: 'orderId必填' })
        }
        if (payType === 'balance') {
            return request({ url: `/api/order/detail/${encodeURIComponent(orderId)}`, method: 'GET' }).then(detailRes => {
                if (detailRes.code !== 0 || !detailRes.data) return detailRes
                const need = Number(detailRes.data.totalPrice || detailRes.data.pay_amount || 0)
                return requestWallet({ url: '/wallet/consume', method: 'POST', data: { amount: need } }).then(wRes => {
                    if (wRes.code !== 0) return wRes
                    if (wRes.data && typeof wRes.data.balance !== 'undefined') {
                        storage.setBalance(wRes.data.balance)
                    }
                    return request({ url: '/api/order/pay', method: 'POST', data: { ...data, payType: 'wechat' } })
                })
            }).then(res => {
                if (res.code === 0) {
                    const cart = storage.getCart().filter(item => !item.selected)
                    storage.setCart(cart)
                }
                return res
            })
        }

        return request({
            url: '/api/order/pay',
            method: 'POST',
            data
        }).then(res => {
            if (res.code === 0) {
                const cart = storage.getCart().filter(item => !item.selected)
                storage.setCart(cart)
            }
            return res
        })
    },

    cancelOrder(id) {
        return request({ url: '/api/order/cancel', method: 'POST', data: { orderId: id } })
    },

    // ==================== 消息相关 ====================

    getMessages() {
        return delay().then(() => ({ code: 0, data: mockData.messages }))
    },

    // ==================== 地址相关 ====================

    getAddresses() {
        return delay().then(() => {
            const data = uni.getStorageSync('tg_addresses')
            const addresses = data ? JSON.parse(data) : mockData.addresses
            return { code: 0, data: addresses }
        })
    },

    addAddress(data) {
        return delay().then(() => {
            const stored = uni.getStorageSync('tg_addresses')
            const addresses = stored ? JSON.parse(stored) : [...mockData.addresses]

            if (data.isDefault) {
                addresses.forEach(a => a.isDefault = false)
            }

            if (data.id) {
                const index = addresses.findIndex(a => a.id == data.id)
                if (index > -1) addresses[index] = data
            } else {
                addresses.push({ ...data, id: Date.now() })
            }

            uni.setStorageSync('tg_addresses', JSON.stringify(addresses))
            return { code: 0, data: { id: data.id || Date.now() } }
        })
    },

    getPickupPoints() {
        return delay().then(() => ({ code: 0, data: mockData.pickupPoints }))
    },

    getStations() {
        return delay().then(() => ({ code: 0, data: mockData.stations }))
    }
}
