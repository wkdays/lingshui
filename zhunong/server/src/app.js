import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import { adminAuthRequired } from './middleware/admin-auth.js'
import { authRequired } from './middleware/auth.js'
import { errorHandler, notFound } from './middleware/error.js'
import { bannerRoutes } from './routes/banner.js'
import { noticeRoutes } from './routes/notice.js'
import { orderRoutes } from './routes/order.js'
import { userRoutes } from './routes/user.js'
import { walletRoutes } from './routes/wallet.js'
import { adminAuthRoutes } from './routes/admin/auth.js'
import { adminBannerRoutes } from './routes/admin/banner.js'
import { adminNoticeRoutes } from './routes/admin/notice.js'
import { adminUploadRoutes } from './routes/admin/upload.js'

export const createApp = () => {
  const app = express()

  app.use(cors())
  app.use(express.json({ limit: '50mb' }))
  app.use(morgan('dev'))

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const staticDir = path.resolve(__dirname, '../../static')
  app.use('/static', express.static(staticDir, { fallthrough: false }))

  const adminHtml = path.resolve(staticDir, 'admin.html')
  app.get('/', (req, res) => res.redirect('/admin'))
  app.get('/admin', (req, res) => res.sendFile(adminHtml))

  const adminRouter = express.Router()
  adminAuthRoutes(adminRouter)
  adminRouter.use(/^\/api\/admin\/(?!auth\/login)/, adminAuthRequired)
  adminUploadRoutes(adminRouter)
  adminBannerRoutes(adminRouter)
  adminNoticeRoutes(adminRouter)
  app.use(adminRouter)

  const router = express.Router()
  userRoutes(router)
  bannerRoutes(router)
  noticeRoutes(router)

  router.use(authRequired)
  walletRoutes(router)
  orderRoutes(router)

  app.use(router)
  app.use(notFound)
  app.use(errorHandler)
  return app
}
