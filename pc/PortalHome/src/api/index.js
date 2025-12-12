import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

// 新闻动态
export const newsApi = {
  getList: (params) => api.get('/news', { params }),
  getDetail: (id) => api.get(`/news/${id}`),
  create: (data) => api.post('/news', data),
  update: (id, data) => api.put(`/news/${id}`, data),
  delete: (id) => api.delete(`/news/${id}`)
}

// 招标公告
export const biddingApi = {
  getList: (params) => api.get('/bidding', { params }),
  getDetail: (id) => api.get(`/bidding/${id}`),
  create: (data) => api.post('/bidding', data),
  update: (id, data) => api.put(`/bidding/${id}`, data),
  delete: (id) => api.delete(`/bidding/${id}`)
}

// 项目进度
export const projectApi = {
  getList: (params) => api.get('/project', { params }),
  getDetail: (id) => api.get(`/project/${id}`),
  create: (data) => api.post('/project', data),
  update: (id, data) => api.put(`/project/${id}`, data),
  delete: (id) => api.delete(`/project/${id}`)
}

// 党建工作
export const partyApi = {
  getList: (params) => api.get('/party', { params }),
  getDetail: (id) => api.get(`/party/${id}`),
  create: (data) => api.post('/party', data),
  update: (id, data) => api.put(`/party/${id}`, data),
  delete: (id) => api.delete(`/party/${id}`)
}

// 轮播图/核心动态
export const carouselApi = {
  getList: () => api.get('/carousel'),
  create: (data) => api.post('/carousel', data),
  update: (id, data) => api.put(`/carousel/${id}`, data),
  delete: (id) => api.delete(`/carousel/${id}`)
}

// 文件上传
export const uploadApi = {
  upload: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

// 登录
export const authApi = {
  login: (data) => api.post('/auth/login', data)
}

export default api
