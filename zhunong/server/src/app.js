import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { authRequired } from './middleware/auth.js'
import { errorHandler, notFound } from './middleware/error.js'
import { bannerRoutes } from './routes/banner.js'
import { noticeRoutes } from './routes/notice.js'
import { orderRoutes } from './routes/order.js'
import { userRoutes } from './routes/user.js'
import { walletRoutes } from './routes/wallet.js'
import { adminBannerRoutes } from './routes/admin/banner.js'
import { adminNoticeRoutes } from './routes/admin/notice.js'

export const createApp = () => {
  const app = express()

  app.use(cors())
  app.use(express.json({ limit: '2mb' }))
  app.use(morgan('dev'))

  const router = express.Router()
  userRoutes(router)
  bannerRoutes(router)
  noticeRoutes(router)

  // 管理端接口（未做权限控制，可按需自行加鉴权）
  adminBannerRoutes(router)
  adminNoticeRoutes(router)

  router.use(authRequired)
  walletRoutes(router)
  orderRoutes(router)

  app.use(router)
  app.use(notFound)
  app.use(errorHandler)
  return app
}
