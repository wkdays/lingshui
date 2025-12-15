// 本地存储工具

const TOKEN_KEY = 'tuancan_token'
const USER_KEY = 'tuancan_user'
const CART_KEY = 'tuancan_cart'

// Token
export const getToken = () => {
  return uni.getStorageSync(TOKEN_KEY)
}

export const setToken = (token) => {
  uni.setStorageSync(TOKEN_KEY, token)
}

export const removeToken = () => {
  uni.removeStorageSync(TOKEN_KEY)
}

// 用户信息
export const getUser = () => {
  return uni.getStorageSync(USER_KEY)
}

export const setUser = (user) => {
  uni.setStorageSync(USER_KEY, user)
}

export const removeUser = () => {
  uni.removeStorageSync(USER_KEY)
}

// 购物车
export const getCartStorage = () => {
  return uni.getStorageSync(CART_KEY) || []
}

export const setCartStorage = (cart) => {
  uni.setStorageSync(CART_KEY, cart)
}

// 清除所有数据
export const clearAll = () => {
  uni.clearStorageSync()
}

export default {
  getToken,
  setToken,
  removeToken,
  getUser,
  setUser,
  removeUser,
  getCartStorage,
  setCartStorage,
  clearAll
}
