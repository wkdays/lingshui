import jwt from 'jsonwebtoken'
import { config } from '../config.js'

export const adminAuthRequired = (req, res, next) => {
  const header = req.headers.authorization || ''
  const match = header.match(/^Bearer\s+(.+)$/i)
  const token = match ? match[1] : null
  if (!token) {
    return res.status(401).json({ code: 401, message: '未登录' })
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret)
    if (!payload || payload.role !== 'admin') {
      return res.status(401).json({ code: 401, message: '未登录' })
    }
    req.admin = { username: payload.username || 'admin' }
    return next()
  } catch {
    return res.status(401).json({ code: 401, message: '登录已过期' })
  }
}
