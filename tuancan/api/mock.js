// Mock数据接口 - 后端开发完成后替换为真实接口
// 余额持久化到本地存储，模拟四个小程序共享余额

import { getToken as getLocalToken } from '@/utils/storage.js'

// 管理后台API地址（开发时使用本地地址，生产环境替换为实际地址）
const ADMIN_API_BASE = 'http://localhost:3001'

const ZONGLIAN_API_BASE = 'http://127.0.0.1:8080/api'

// 模拟延迟（设为0实现立即返回）
const delay = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))

// 调用管理后台API（设置1秒超时，快速回退到本地数据）
const fetchAdminApi = async (url) => {
  try {
    const res = await new Promise((resolve, reject) => {
      uni.request({
        url: `${ADMIN_API_BASE}${url}`,
        method: 'GET',
        timeout: 1000,
        success: (response) => resolve(response),
        fail: (err) => reject(err)
      })
    })
    if (res.statusCode === 200 && res.data) {
      return res.data
    }
    return null
  } catch (e) {
    return null
  }
}

const fetchZonglianApi = async ({ url, method = 'GET', data, token } = {}) => {
  try {
    const res = await new Promise((resolve, reject) => {
      uni.request({
        url: `${ZONGLIAN_API_BASE}${url}`,
        method,
        data,
        timeout: 5000,
        header: token ? { Authorization: `Bearer ${token}` } : {},
        success: (response) => resolve(response),
        fail: (err) => reject(err)
      })
    })
    if (res.statusCode === 200 && res.data) {
      return res.data
    }
    return null
  } catch (e) {
    return null
  }
}

// 调用管理后台POST API
const postAdminApi = async (url, data) => {
  try {
    const res = await new Promise((resolve, reject) => {
      uni.request({
        url: `${ADMIN_API_BASE}${url}`,
        method: 'POST',
        data: data,
        timeout: 2000,
        header: { 'Content-Type': 'application/json' },
        success: (response) => resolve(response),
        fail: (err) => reject(err)
      })
    })
    if (res.statusCode === 200 && res.data) {
      return res.data
    }
    return null
  } catch (e) {
    return null
  }
}

// ============ 下单时间限制配置 ============
const ORDER_TIME_CONFIG = {
  workday: {
    breakfast: { hour: 17, minute: 0, dayOffset: -1, desc: '前一天17:00前' },
    lunch: { hour: 9, minute: 0, dayOffset: 0, desc: '当天9:00前' },
    dinner: { hour: 14, minute: 0, dayOffset: 0, desc: '当天14:00前' },
    afternoon: { hour: 11, minute: 0, dayOffset: 0, desc: '当天11:00前' }
  },
  weekend: {
    breakfast: { hour: 17, minute: 0, dayOffset: -1, desc: '前一天17:00前' },
    lunch: { hour: 17, minute: 0, dayOffset: -1, desc: '前一天17:00前' },
    dinner: { hour: 17, minute: 0, dayOffset: -1, desc: '前一天17:00前' },
    afternoon: { hour: 17, minute: 0, dayOffset: -1, desc: '前一天17:00前' }
  }
}

// 判断是否为周末
const isWeekend = (date) => {
  const day = date.getDay()
  return day === 0 || day === 6
}

// 检查下单时间（本地校验）
const checkOrderTimeLocal = (deliveryDate, mealTime) => {
  const delivery = new Date(deliveryDate)
  const now = new Date()
  const weekend = isWeekend(delivery)
  const config = weekend ? ORDER_TIME_CONFIG.weekend : ORDER_TIME_CONFIG.workday
  const mealConfig = config[mealTime]
  
  if (!mealConfig) return { canOrder: true, reason: '' }
  
  const deadline = new Date(delivery)
  deadline.setDate(deadline.getDate() + mealConfig.dayOffset)
  deadline.setHours(mealConfig.hour, mealConfig.minute, 0, 0)
  
  const canOrder = now < deadline
  const dayType = weekend ? '周末' : '工作日'
  const mealNames = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐', afternoon: '下午茶' }
  
  return {
    canOrder,
    deadline: deadline.toISOString(),
    rule: mealConfig.desc,
    isWeekend: weekend,
    reason: canOrder ? '' : `${dayType}${mealNames[mealTime]}下单已截止（需${mealConfig.desc}下单）`
  }
}

// 检查取消订单时间
const checkCancelTimeLocal = (deliveryDate) => {
  const delivery = new Date(deliveryDate)
  const now = new Date()
  
  // 取消截止时间：配送日期前一天的17:00
  const deadline = new Date(delivery)
  deadline.setDate(deadline.getDate() - 1)
  deadline.setHours(17, 0, 0, 0)
  
  const canCancel = now < deadline
  
  return {
    canCancel,
    deadline: deadline.toISOString(),
    reason: canCancel ? '' : '订单取消已截止（需提前一天17:00前取消），如需取消请联系客服'
  }
}

// 余额存储Key（四个小程序共用同一个Key实现共享）
const BALANCE_KEY = 'tuancan_shared_balance'
const TRANSACTIONS_KEY = 'tuancan_transactions'

// 获取持久化余额
const getStoredBalance = () => {
  try {
    const balance = uni.getStorageSync(BALANCE_KEY)
    return balance !== '' ? parseFloat(balance) : 800000.00
  } catch (e) {
    return 800000.00
  }
}

// 保存余额到本地
const saveBalance = (balance) => {
  try {
    uni.setStorageSync(BALANCE_KEY, balance.toString())
  } catch (e) {
    console.error('保存余额失败', e)
  }
}

// 获取交易记录
const getStoredTransactions = () => {
  try {
    const data = uni.getStorageSync(TRANSACTIONS_KEY)
    return data ? JSON.parse(data) : []
  } catch (e) {
    return []
  }
}

// 保存交易记录
const saveTransactions = (transactions) => {
  try {
    uni.setStorageSync(TRANSACTIONS_KEY, JSON.stringify(transactions))
  } catch (e) {
    console.error('保存交易记录失败', e)
  }
}

// 用户信息（余额从本地存储读取）
const mockUser = {
  id: 'user_001',
  nickname: '张三',
  avatar: '/static/images/default-avatar.png',
  phone: '138****8888',
  get balance() { return getStoredBalance() },
  set balance(val) { saveBalance(val) }
}

// 轮播图数据（备用，后台不可用时使用）
const mockBanners = [
  { id: 1, image: '/static/images/banner1.png', title1: '机关食堂', title2: '营养配餐', sub: '科学搭配 健康饮食', link: '' },
  { id: 2, image: '/static/images/banner2.png', title1: '职工福利', title2: '团餐优惠', sub: '储值卡消费享折扣', link: '/pages/special/special' },
  { id: 3, image: '/static/images/banner3.png', title1: '便民服务', title2: '在线订餐', sub: '提前预订 按时取餐', link: '/pages/shop/list' }
]

// 公告数据（备用，后台不可用时使用）
const mockNotices = [
  { id: 1, type: 'notice', title: '【食堂通知】本周菜单已更新，欢迎预订', time: '2024-01-15', content: '本周食堂新增多款营养套餐，包含：红烧肉套餐、清蒸鱼套餐、素食套餐等，欢迎各位职工通过小程序提前预订。预订时间：每日8:00-17:00。' },
  { id: 2, type: 'activity', title: '【充值优惠】储值卡充值满500送50', time: '2024-01-14', content: '即日起至1月31日，虚拟储值卡充值满500元赠送50元，充值金额可在四个小程序中共享使用。充值方式：我的-余额-充值。' },
  { id: 3, type: 'notice', title: '【配送调整】春节期间食堂营业时间通知', time: '2024-01-13', content: '春节期间（1月20日-1月27日）食堂暂停堂食服务，仅支持预订自取。自取时间：11:00-13:00，17:00-18:30。请各位职工提前做好用餐安排。' },
  { id: 4, type: 'system', title: '【系统公告】小程序功能升级完成', time: '2024-01-12', content: '团餐订购小程序已完成升级，新增功能：1.支持按周预订餐次；2.储值卡余额四小程序共享；3.订单状态实时推送。如有问题请联系后勤服务中心。' }
]

// 商家列表
const mockShops = [
  { id: 1, name: '中央厨房', logo: '/static/images/shop1.png', score: 4.8, distance: '500m', tags: ['品质保障', '配送快'], minPrice: 15 },
  { id: 2, name: '健康轻食', logo: '/static/images/shop2.png', score: 4.6, distance: '800m', tags: ['低卡', '健康'], minPrice: 20 },
  { id: 3, name: '家常小炒', logo: '/static/images/shop3.png', score: 4.5, distance: '1.2km', tags: ['家常菜', '实惠'], minPrice: 12 }
]

// 商品分类（备用）
const mockCategories = [
  { id: 1, name: '全部' },
  { id: 2, name: '早餐' },
  { id: 3, name: '午餐' },
  { id: 4, name: '晚餐' },
  { id: 5, name: '特价' }
]

// 商品列表（备用）
const mockProducts = [
  { id: 1, name: '香米饭套餐', image: '/static/images/food1.png', price: 12, originalPrice: 15, stock: 50, sales: 328, isSpecial: true, categoryId: 3, shopId: 1, specs: ['小份', '大份'], description: '香喷喷的白米饭' },
  { id: 2, name: '咖喱炒饭', image: '/static/images/food2.png', price: 25, originalPrice: 25, stock: 30, sales: 256, isSpecial: false, categoryId: 3, shopId: 1, specs: ['标准'], description: '香浓咖喱，米饭Q弹' },
  { id: 3, name: '蛋炒饭', image: '/static/images/food3.png', price: 10, originalPrice: 12, stock: 100, sales: 189, isSpecial: true, categoryId: 3, shopId: 1, specs: ['小份', '大份'], description: '经典蛋炒饭' },
  { id: 4, name: '米饭便当', image: '/static/images/food4.png', price: 8, originalPrice: 8, stock: 80, sales: 412, isSpecial: false, categoryId: 2, shopId: 1, specs: ['标准'], description: '营养均衡便当' },
  { id: 5, name: '印度薄饼', image: '/static/images/food5.png', price: 6, originalPrice: 8, stock: 60, sales: 523, isSpecial: true, categoryId: 2, shopId: 1, specs: ['标准', '加料'], description: '外酥里嫩' },
  { id: 6, name: '海鲜炒饭', image: '/static/images/food6.png', price: 38, originalPrice: 45, stock: 20, sales: 88, isSpecial: true, categoryId: 4, shopId: 1, specs: ['标准'], description: '鲜美海鲜配饭' },
  { id: 7, name: '咖喱鸡肉饭', image: '/static/images/food7.png', price: 18, originalPrice: 18, stock: 45, sales: 302, isSpecial: false, categoryId: 3, shopId: 1, specs: ['小份', '大份'], description: '浓郁咖喱鸡' },
  { id: 8, name: '什锦炒饭', image: '/static/images/food8.png', price: 8, originalPrice: 10, stock: 120, sales: 445, isSpecial: true, categoryId: 3, shopId: 1, specs: ['标准'], description: '多种配料' }
]

// 购物车数据（从本地存储读取）
let mockCart = uni.getStorageSync('mockCart') || []

// 保存购物车到本地存储
function saveCart() {
  uni.setStorageSync('mockCart', mockCart)
}

// 订单状态
const ORDER_STATUS = {
  PENDING_PAY: 0,      // 待支付
  PENDING_DELIVER: 1,  // 待发货
  PENDING_PICKUP: 2,   // 待自取
  DELIVERING: 3,       // 配送中
  COMPLETED: 4,        // 已完成
  CANCELLED: 5         // 已取消
}

// 订单列表
let mockOrders = [
  {
    id: 'ORDER202401150001',
    status: ORDER_STATUS.COMPLETED,
    statusText: '已完成',
    createTime: '2024-01-15 12:30:00',
    payTime: '2024-01-15 12:30:15',
    totalAmount: 45.00,
    payAmount: 45.00,
    deliveryType: 1, // 0-到店取货 1-送到驿站 2-送货上门
    deliveryAddress: '3号楼驿站',
    products: [
      { id: 1, name: '香米饭套餐', image: '/static/images/food1.png', price: 12, quantity: 2, spec: '大份' },
      { id: 2, name: '咖喱炒饭', image: '/static/images/food2.png', price: 25, quantity: 1, spec: '标准' }
    ]
  }
]

// 交易明细
const mockTransactions = [
  { id: 1, type: 'consume', title: '订餐消费', amount: -45.00, time: '2024-01-15 12:30:15', orderId: 'ORDER202401150001' },
  { id: 2, type: 'recharge', title: '余额充值', amount: 200.00, time: '2024-01-14 10:00:00', orderId: '' },
  { id: 3, type: 'consume', title: '订餐消费', amount: -32.00, time: '2024-01-13 18:20:30', orderId: 'ORDER202401130002' }
]

// 消息列表
const mockMessages = [
  { id: 1, type: 'order', title: '订单已完成', content: '您的订单ORDER202401150001已完成，感谢您的使用！', time: '2024-01-15 13:00:00', read: false },
  { id: 2, type: 'system', title: '系统通知', content: '您的账户已成功充值200元', time: '2024-01-14 10:00:05', read: true }
]

// 周餐次数据（参考1.png的日期选择界面）
const generateWeekMeals = (startDate) => {
  const meals = []
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  // 确保startDate是有效的Date对象
  let baseDate = startDate
  if (!baseDate || !(baseDate instanceof Date) || isNaN(baseDate.getTime())) {
    baseDate = new Date()
  }
  for (let i = 0; i < 7; i++) {
    const date = new Date(baseDate.getTime())
    date.setDate(date.getDate() + i)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekDay = weekDays[date.getDay()]
    meals.push({
      date: `${month}.${day}`,
      weekDay: weekDay,
      breakfast: { selected: false, price: 15 },
      lunch: { selected: false, price: 20 },
      dinner: { selected: false, price: 18 }
    })
  }
  return meals
}

// ============ API接口 ============

// 用户相关
export const userApi = {
  // 登录
  async login(params) {
    await delay()
    const phone = params?.phone || (params?.type === 'wechat' ? '13800138000' : '')
    const password = params?.password || (params?.type === 'wechat' ? '123456' : '')
    const res = await fetchZonglianApi({ url: '/auth/login', method: 'POST', data: { phone, password } })
    if (res && res.code === 0 && res.data) {
      if (res.data.user && typeof res.data.user.balance !== 'undefined') {
        saveBalance(res.data.user.balance)
      }
      return { code: 0, data: { token: res.data.token, userInfo: res.data.user }, msg: 'success' }
    }
    return { code: res?.code ?? -1, data: null, msg: res?.message || '登录失败' }
  },
  // 获取用户信息
  async getUserInfo() {
    await delay()
    return { code: 0, data: mockUser, msg: 'success' }
  },
  // 获取余额
  async getBalance() {
    await delay()
    const token = getLocalToken()
    if (!token) {
      return { code: 401, data: null, msg: '未登录' }
    }
    const res = await fetchZonglianApi({ url: '/wallet/balance', method: 'GET', token })
    if (res && res.code === 0 && res.data) {
      if (typeof res.data.balance !== 'undefined') {
        saveBalance(res.data.balance)
      }
      return { code: 0, data: { balance: Number(res.data.balance || 0) }, msg: 'success' }
    }
    return { code: res?.code ?? -1, data: { balance: getStoredBalance() }, msg: res?.message || '获取余额失败' }
  }
}

// 首页相关
export const homeApi = {
  // 获取轮播图（优先从后台获取）
  async getBanners() {
    const res = await fetchAdminApi('/api/mp/banners')
    if (res && res.code === 0) {
      return res
    }
    // 后台不可用时使用本地数据
    await delay()
    return { code: 0, data: mockBanners, msg: 'success' }
  },
  // 获取公告（优先从后台获取）
  async getNotices() {
    const res = await fetchAdminApi('/api/mp/notices')
    if (res && res.code === 0) {
      return res
    }
    // 后台不可用时使用本地数据
    await delay()
    return { code: 0, data: mockNotices, msg: 'success' }
  },
  // 获取推荐商品
  async getRecommendProducts() {
    const res = await fetchAdminApi('/api/mp/dishes')
    if (res && res.code === 0) {
      // 返回前4个菜品作为推荐
      return { code: 0, data: res.data.slice(0, 4), msg: 'success' }
    }
    await delay()
    const recommended = mockProducts.filter(p => p.sales > 200).slice(0, 4)
    return { code: 0, data: recommended, msg: 'success' }
  },
  // 获取周餐次数据
  async getWeekMeals(startDate) {
    await delay()
    return { code: 0, data: generateWeekMeals(startDate || new Date()), msg: 'success' }
  }
}

// 商家相关
export const shopApi = {
  // 获取商家列表
  async getShopList(params) {
    await delay()
    return { code: 0, data: mockShops, msg: 'success' }
  },
  // 获取商家详情
  async getShopDetail(id) {
    await delay()
    const shop = mockShops.find(s => s.id === id)
    return { code: 0, data: shop, msg: 'success' }
  }
}

// 商品相关
export const productApi = {
  // 获取分类（优先从后台获取）
  async getCategories() {
    const res = await fetchAdminApi('/api/mp/categories')
    if (res && res.code === 0) {
      return res
    }
    await delay()
    return { code: 0, data: mockCategories, msg: 'success' }
  },
  // 获取商品列表（优先从后台获取）
  async getProductList(params = {}) {
    // 构建查询参数
    let url = '/api/mp/dishes?'
    if (params.categoryId && params.categoryId !== 1) {
      if (params.categoryId === 5) {
        url += 'is_special=1&'
      } else {
        url += `category_id=${params.categoryId}&`
      }
    }
    if (params.mealTime) {
      url += `meal_time=${params.mealTime}&`
    }
    const res = await fetchAdminApi(url)
    if (res && res.code === 0) {
      let list = res.data
      if (params.keyword) {
        list = list.filter(p => p.name.includes(params.keyword))
      }
      return { code: 0, data: list, msg: 'success' }
    }
    // 后台不可用时使用本地数据
    await delay()
    let list = [...mockProducts]
    if (params.categoryId && params.categoryId !== 1) {
      if (params.categoryId === 5) {
        list = list.filter(p => p.isSpecial)
      } else {
        list = list.filter(p => p.categoryId === params.categoryId)
      }
    }
    if (params.shopId) {
      list = list.filter(p => p.shopId === params.shopId)
    }
    if (params.keyword) {
      list = list.filter(p => p.name.includes(params.keyword))
    }
    return { code: 0, data: list, msg: 'success' }
  },
  // 获取商品详情（优先从后台获取）
  async getProductDetail(id) {
    const res = await fetchAdminApi(`/api/mp/dishes/${id}`)
    if (res && res.code === 0) {
      return res
    }
    await delay()
    const product = mockProducts.find(p => p.id === id)
    return { code: 0, data: product, msg: 'success' }
  },
  // 获取特价商品（优先从后台获取）
  async getSpecialProducts() {
    const res = await fetchAdminApi('/api/mp/specials')
    if (res && res.code === 0) {
      return res
    }
    await delay()
    const specials = mockProducts.filter(p => p.isSpecial)
    return { code: 0, data: specials, msg: 'success' }
  }
}

// 购物车相关
export const cartApi = {
  // 获取购物车
  async getCart() {
    await delay()
    mockCart = uni.getStorageSync('mockCart') || []
    return { code: 0, data: mockCart, msg: 'success' }
  },
  // 添加到购物车
  async addToCart(product, quantity = 1, spec = '') {
    await delay()
    // 重新读取最新数据
    mockCart = uni.getStorageSync('mockCart') || []
    const existIndex = mockCart.findIndex(item => item.id === product.id && item.spec === (product.spec || spec))
    if (existIndex > -1) {
      mockCart[existIndex].quantity += quantity
    } else {
      mockCart.push({
        ...product,
        quantity,
        spec: product.spec || spec,
        checked: true
      })
    }
    saveCart()
    return { code: 0, data: mockCart, msg: 'success' }
  },
  // 更新购物车商品数量
  async updateCartItem(id, quantity, spec) {
    await delay()
    mockCart = uni.getStorageSync('mockCart') || []
    const item = mockCart.find(item => item.id === id && item.spec === spec)
    if (item) {
      item.quantity = quantity
    }
    saveCart()
    return { code: 0, data: mockCart, msg: 'success' }
  },
  // 删除购物车商品
  async removeFromCart(id, spec) {
    await delay()
    mockCart = uni.getStorageSync('mockCart') || []
    mockCart = mockCart.filter(item => !(item.id === id && item.spec === spec))
    saveCart()
    return { code: 0, data: mockCart, msg: 'success' }
  },
  // 清空购物车
  async clearCart() {
    await delay()
    mockCart = []
    saveCart()
    return { code: 0, data: mockCart, msg: 'success' }
  }
}

// 订单相关
export const orderApi = {
  // 检查下单时间
  async checkOrderTime(deliveryDate, mealTime) {
    // 优先调用后台API
    const res = await postAdminApi('/api/check-order-time', { deliveryDate, mealTime })
    if (res && res.code === 0) {
      return res
    }
    // 后台不可用时使用本地校验
    const result = checkOrderTimeLocal(deliveryDate, mealTime)
    return { code: result.canOrder ? 0 : -1, data: result, msg: result.reason || 'success' }
  },
  
  // 检查库存
  async checkStock(items) {
    // 调用后台API检查库存
    const res = await postAdminApi('/api/check-stock', { items })
    if (res) {
      return res
    }
    // 后台不可用时默认通过
    return { code: 0, data: { sufficient: true, insufficientItems: [] }, msg: 'success' }
  },
  
  // 扣减库存
  async deductStock(items) {
    const res = await postAdminApi('/api/deduct-stock', { items })
    return res || { code: 0, msg: 'success' }
  },
  
  // 恢复库存
  async restoreStock(items) {
    const res = await postAdminApi('/api/restore-stock', { items })
    return res || { code: 0, msg: 'success' }
  },
  
  // 创建订单（带时间和库存校验）
  async createOrder(params) {
    await delay()
    
    // 1. 检查下单时间（如果有配送日期和餐次信息）
    if (params.deliveryDate && params.mealTime) {
      const timeCheck = checkOrderTimeLocal(params.deliveryDate, params.mealTime)
      if (!timeCheck.canOrder) {
        return { code: -1, data: null, msg: timeCheck.reason }
      }
    }
    
    // 2. 检查库存（如果商品有dishId）
    const stockItems = params.products
      .filter(p => p.dishId || p.id)
      .map(p => ({ dishId: p.dishId || p.id, quantity: p.quantity || 1 }))
    
    if (stockItems.length > 0) {
      const stockRes = await postAdminApi('/api/check-stock', { items: stockItems })
      if (stockRes && stockRes.code !== 0) {
        return { code: -1, data: stockRes.data, msg: stockRes.msg || '库存不足' }
      }
    }
    
    const orderId = 'ORDER' + Date.now()
    const newOrder = {
      id: orderId,
      orderNo: orderId,
      status: ORDER_STATUS.PENDING_PAY,
      statusText: '待支付',
      createTime: new Date().toLocaleString(),
      totalAmount: params.totalAmount,
      payAmount: params.payAmount,
      deliveryType: params.deliveryType,
      deliveryAddress: params.deliveryAddress,
      deliveryDate: params.deliveryDate,
      contactName: params.contactName,
      contactPhone: params.contactPhone,
      remark: params.remark,
      products: params.products
    }
    mockOrders.unshift(newOrder)
    return { code: 0, data: newOrder, msg: 'success' }
  },
  // 支付订单（使用虚拟储值卡余额支付）
  async payOrder(orderId, payType) {
    await delay()
    const order = mockOrders.find(o => o.id === orderId)
    if (order) {
      if (payType === 0) {
        const token = getLocalToken()
        if (!token) {
          return { code: 401, data: null, msg: '未登录' }
        }
        const res = await fetchZonglianApi({ url: '/wallet/consume', method: 'POST', data: { amount: order.payAmount }, token })
        if (!res || res.code !== 0) {
          const message = res?.message || res?.msg || '支付失败'
          return { code: res?.code ?? -1, data: null, msg: message }
        }
        if (res.data && typeof res.data.balance !== 'undefined') {
          saveBalance(res.data.balance)
        }
        const transactions = getStoredTransactions()
        transactions.unshift({
          id: Date.now(),
          type: 'consume',
          title: '订餐消费',
          amount: -order.payAmount,
          time: new Date().toLocaleString(),
          orderId: orderId
        })
        saveTransactions(transactions)
      }
      // 更新订单状态
      order.status = ORDER_STATUS.PENDING_DELIVER
      order.statusText = '待发货'
      order.payTime = new Date().toLocaleString()
    }
    return { code: 0, data: order, msg: 'success' }
  },
  // 获取订单列表
  async getOrderList(status) {
    await delay()
    let list = [...mockOrders]
    if (status !== undefined && status !== -1) {
      list = list.filter(o => o.status === status)
    }
    return { code: 0, data: list, msg: 'success' }
  },
  // 获取订单详情
  async getOrderDetail(orderId) {
    await delay()
    const order = mockOrders.find(o => o.id === orderId)
    return { code: 0, data: order, msg: 'success' }
  },
  // 取消订单（需提前1天17:00前取消）
  async cancelOrder(orderId) {
    await delay()
    const order = mockOrders.find(o => o.id === orderId)
    if (!order) {
      return { code: -1, data: null, msg: '订单不存在' }
    }
    
    // 检查取消时间限制
    const deliveryDate = order.deliveryDate || order.createTime
    const cancelCheck = checkCancelTimeLocal(deliveryDate)
    if (!cancelCheck.canCancel) {
      return { code: -1, data: null, msg: cancelCheck.reason }
    }
    
    // 已支付订单退款
    if (order.status === ORDER_STATUS.PENDING_DELIVER || order.status === ORDER_STATUS.PENDING_PICKUP) {
      const currentBalance = getStoredBalance()
      const newBalance = currentBalance + order.payAmount
      saveBalance(newBalance)
      // 记录退款交易
      const transactions = getStoredTransactions()
      transactions.unshift({
        id: Date.now(),
        type: 'recharge',
        title: '订单退款',
        amount: order.payAmount,
        time: new Date().toLocaleString(),
        orderId: orderId
      })
      saveTransactions(transactions)
      
      // 恢复库存
      const stockItems = order.products
        .filter(p => p.dishId || p.id)
        .map(p => ({ dishId: p.dishId || p.id, quantity: p.quantity || 1 }))
      if (stockItems.length > 0) {
        await postAdminApi('/api/restore-stock', { items: stockItems })
      }
    }
    
    order.status = ORDER_STATUS.CANCELLED
    order.statusText = '已取消'
    order.cancelTime = new Date().toLocaleString()
    
    return { code: 0, data: order, msg: '订单已取消，退款已返还至余额' }
  },
  // 确认收货
  async confirmOrder(orderId) {
    await delay()
    const order = mockOrders.find(o => o.id === orderId)
    if (order) {
      order.status = ORDER_STATUS.COMPLETED
      order.statusText = '已完成'
    }
    return { code: 0, data: order, msg: 'success' }
  },
  // 打印订单（支付成功后触发，推送至飞鹅云打印机）
  async printOrder(orderId) {
    await delay()
    const order = mockOrders.find(o => o.id === orderId)
    if (!order) {
      return { code: -1, data: null, msg: '订单不存在' }
    }
    
    // 调用后台打印API（对接飞鹅云打印机）
    const printRes = await postAdminApi('/api/printer/print', { 
      order: {
        id: order.id,
        orderNo: order.orderNo || order.id,
        createTime: order.createTime,
        payTime: order.payTime,
        deliveryType: order.deliveryType,
        deliveryAddress: order.deliveryAddress,
        deliveryDate: order.deliveryDate,
        contactName: order.contactName,
        contactPhone: order.contactPhone,
        remark: order.remark,
        products: order.products,
        totalAmount: order.totalAmount,
        payAmount: order.payAmount,
        deliveryFee: order.deliveryFee || 0
      },
      times: 1
    })
    
    if (printRes && printRes.code === 0) {
      order.printStatus = 1
      order.printId = printRes.data?.printId
      return { 
        code: 0, 
        data: { 
          printed: true, 
          printId: printRes.data?.printId,
          mock: printRes.data?.mock || false
        }, 
        msg: printRes.msg || '打印任务已推送' 
      }
    }
    
    // 后台不可用时，本地模拟打印
    console.log('=== 本地模拟打印（后台不可用） ===')
    console.log('订单号:', order.id)
    console.log('配送地址:', order.deliveryAddress)
    console.log('商品:', order.products.map(p => `${p.name} x${p.quantity || 1}`).join(', '))
    console.log('金额:', order.payAmount)
    
    return { 
      code: 0, 
      data: { printed: true, mock: true }, 
      msg: '打印任务已推送（模拟）' 
    }
  },
  
  // 获取下单时间规则
  getOrderTimeConfig() {
    return ORDER_TIME_CONFIG
  },
  
  // 检查指定日期各餐次的可下单状态
  getAvailableMeals(deliveryDate) {
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'afternoon']
    const result = {}
    for (const mealType of mealTypes) {
      result[mealType] = checkOrderTimeLocal(deliveryDate, mealType)
    }
    return result
  }
}

// 交易明细（从本地存储读取）
export const transactionApi = {
  async getTransactions() {
    await delay()
    // 优先使用持久化的交易记录，没有则使用默认数据
    const storedTransactions = getStoredTransactions()
    const data = storedTransactions.length > 0 ? storedTransactions : mockTransactions
    return { code: 0, data: data, msg: 'success' }
  },
  // 添加充值记录
  async addRecharge(amount) {
    await delay()
    // 增加余额
    const currentBalance = getStoredBalance()
    const newBalance = currentBalance + amount
    saveBalance(newBalance)
    // 记录交易
    const transactions = getStoredTransactions()
    transactions.unshift({
      id: Date.now(),
      type: 'recharge',
      title: '余额充值',
      amount: amount,
      time: new Date().toLocaleString(),
      orderId: ''
    })
    saveTransactions(transactions)
    return { code: 0, data: { balance: newBalance }, msg: 'success' }
  }
}

// 消息相关
export const messageApi = {
  async getMessages() {
    await delay()
    return { code: 0, data: mockMessages, msg: 'success' }
  },
  async markAsRead(id) {
    await delay()
    const msg = mockMessages.find(m => m.id === id)
    if (msg) msg.read = true
    return { code: 0, data: null, msg: 'success' }
  }
}

export default {
  userApi,
  homeApi,
  shopApi,
  productApi,
  cartApi,
  orderApi,
  transactionApi,
  messageApi
}
