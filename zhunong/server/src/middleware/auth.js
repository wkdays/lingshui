import jwt from 'jsonwebtoken'
import { config } from '../config.js'

import http from 'http'
import https from 'https'
import { URL } from 'url'

const verifyWithZonglian = token => {
  return new Promise(resolve => {
    try {
      const u = new URL('/api/auth/verify', config.zonglianBaseUrl)
      const isHttps = u.protocol === 'https:'
      const client = isHttps ? https : http
      const req = client.request(
        {
          method: 'GET',
          hostname: u.hostname,
          port: u.port || (isHttps ? 443 : 80),
          path: u.pathname + (u.search || ''),
          headers: { Authorization: `Bearer ${token}` }
        },
        res => {
          let raw = ''
          res.on('data', chunk => {
            raw += String(chunk)
          })
          res.on('end', () => {
            try {
              const body = raw ? JSON.parse(raw) : null
              if (body && body.code === 0 && body.data && body.data.id) {
                resolve({ id: body.data.id })
                return
              }
              resolve(null)
            } catch {
              resolve(null)
            }
          })
        }
      )
      req.on('error', () => resolve(null))
      req.end()
    } catch {
      resolve(null)
    }
  })
}

export const authRequired = (req, res, next) => {
  const header = req.headers.authorization || ''
  const match = header.match(/^Bearer\s+(.+)$/i)
  const token = match ? match[1] : null
  if (!token) {
    return res.status(401).json({ code: 401, message: '未登录' })
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret)
    req.user = { id: payload.id }
    return next()
  } catch {
    verifyWithZonglian(token).then(user => {
      if (!user) {
        return res.status(401).json({ code: 401, message: '登录已过期' })
      }
      req.user = { id: user.id }
      return next()
    })
  }
}

