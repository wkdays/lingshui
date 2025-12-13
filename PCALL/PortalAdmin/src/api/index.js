import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'

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
    const msg = error.response?.data?.error || '请求失败'
    ElMessage.error(msg)
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

// 认证接口
export const login = (data) => api.post('/auth/login', data)

// 通用CRUD接口生成
const createAPI = (resource) => ({
  list: (params) => api.get(`/${resource}`, { params }),
  get: (id) => api.get(`/${resource}/${id}`),
  create: (data) => api.post(`/${resource}`, data),
  update: (id, data) => api.put(`/${resource}/${id}`, data),
  delete: (id) => api.delete(`/${resource}/${id}`)
})

export const newsApi = createAPI('news')
export const biddingApi = createAPI('bidding')
export const projectApi = createAPI('project')
export const partyApi = createAPI('party')
export const carouselApi = createAPI('carousel')

// 文件上传
export const uploadFile = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export default api
