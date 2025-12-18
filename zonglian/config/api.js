// API配置文件
// 统一账号体系 + 管理端接口使用真实后端

// 后端服务地址配置
const API_BASE_URL = 'http://127.0.0.1:8080/api'
const SERVER_URL = 'http://127.0.0.1:8080'

// 请求封装（自动带Token）
const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    uni.request({
      ...options,
      url: API_BASE_URL + options.url,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header,
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

// ==================== 认证接口（统一账号体系） ====================
export const authApi = {
  // 登录
  login: (phone, password) => request({ url: '/auth/login', method: 'POST', data: { phone, password } }),
  
  // 注册
  register: (phone, password, nickname) => request({ url: '/auth/register', method: 'POST', data: { phone, password, nickname } }),
  
  // 验证Token（SSO，其他小程序调用）
  verify: () => request({ url: '/auth/verify', method: 'GET' }),
  
  // 获取用户信息
  getProfile: () => request({ url: '/user/profile', method: 'GET' }),
}

// 真实接口 - 轮播图管理（管理端SpringBoot）
export const realApi = {
  // 获取轮播图列表
  getBanners: () => request({ url: '/banners', method: 'GET' }),
  
  // 新增轮播图
  createBanner: (data) => request({ url: '/banners', method: 'POST', data }),
  
  // 更新轮播图
  updateBanner: (id, data) => request({ url: `/banners/${id}`, method: 'PUT', data }),
  
  // 删除轮播图
  deleteBanner: (id) => request({ url: `/banners/${id}`, method: 'DELETE' }),
  
  // 获取公告列表
  getAnnouncements: () => request({ url: '/announcements', method: 'GET' }),
  
  // 新增公告
  createAnnouncement: (data) => request({ url: '/announcements', method: 'POST', data }),
  
  // 更新公告
  updateAnnouncement: (id, data) => request({ url: `/announcements/${id}`, method: 'PUT', data }),
  
  // 删除公告
  deleteAnnouncement: (id) => request({ url: `/announcements/${id}`, method: 'DELETE' }),
  
  // 切换公告发布状态
  toggleAnnouncementStatus: (id, status) => request({ url: `/announcements/${id}/status`, method: 'PATCH', data: { status } }),
  
  // 获取任务列表
  getTasks: (params) => request({ url: '/tasks', method: 'GET', data: params }),
  
  // 获取任务详情
  getTaskDetail: (id) => request({ url: `/tasks/${id}`, method: 'GET' }),
  
  // 用户接单
  acceptTask: (taskId) => request({ url: `/tasks/${taskId}/accept`, method: 'POST' }),
  
  // 获取我接的单
  getMyOrders: () => request({ url: '/orders/my', method: 'GET' }),
  
  // 提交完成
  submitOrder: (orderId, submitInfo) => request({ url: `/orders/${orderId}/submit`, method: 'PATCH', data: { submitInfo } }),
  
  // 获取我发布的任务
  getMyPublished: () => request({ url: '/tasks/my-published', method: 'GET' }),
}

export { API_BASE_URL, SERVER_URL, request }
