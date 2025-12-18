import jwt from 'jsonwebtoken'
import { config } from '../../config.js'
import { asyncHandler } from '../../utils/async-handler.js'
import { fail, ok } from '../../utils/response.js'

export const adminAuthRoutes = router => {
  router.post(
    '/api/admin/auth/login',
    asyncHandler(async (req, res) => {
      const username = String(req.body?.username || '')
      const password = String(req.body?.password || '')
      if (!username) return fail(res, 'username必填')
      if (!password) return fail(res, 'password必填')

      if (username !== config.admin.user || password !== config.admin.password) {
        return fail(res, '账号或密码错误', -1, 401)
      }

      const token = jwt.sign({ role: 'admin', username }, config.jwtSecret, { expiresIn: '7d' })
      return ok(res, { token, username })
    })
  )
}
