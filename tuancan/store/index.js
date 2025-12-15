// 全局状态管理
import { reactive } from 'vue'

const store = reactive({
  // 用户信息
  userInfo: null,
  token: '',
  isLogin: false,
  
  // 购物车
  cart: [],
  
  // 设置用户信息
  setUserInfo(info) {
    this.userInfo = info
    this.isLogin = !!info
  },
  
  // 设置token
  setToken(token) {
    this.token = token
  },
  
  // 退出登录
  logout() {
    this.userInfo = null
    this.token = ''
    this.isLogin = false
    this.cart = []
  },
  
  // 设置购物车
  setCart(cart) {
    this.cart = cart
  },
  
  // 添加到购物车
  addToCart(product, quantity = 1, spec = '') {
    const existIndex = this.cart.findIndex(item => item.id === product.id && item.spec === spec)
    if (existIndex > -1) {
      this.cart[existIndex].quantity += quantity
    } else {
      this.cart.push({
        ...product,
        quantity,
        spec,
        checked: true
      })
    }
  },
  
  // 更新购物车商品数量
  updateCartQuantity(id, quantity, spec) {
    const item = this.cart.find(item => item.id === id && item.spec === spec)
    if (item) {
      item.quantity = quantity
    }
  },
  
  // 删除购物车商品
  removeFromCart(id, spec) {
    this.cart = this.cart.filter(item => !(item.id === id && item.spec === spec))
  },
  
  // 清空购物车
  clearCart() {
    this.cart = []
  },
  
  // 获取购物车数量
  get cartCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0)
  },
  
  // 获取购物车总价
  get cartTotal() {
    return this.cart.filter(item => item.checked).reduce((sum, item) => sum + item.price * item.quantity, 0)
  }
})

export default store
