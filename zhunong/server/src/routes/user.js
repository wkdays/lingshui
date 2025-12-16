import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../db/pool.js'
import { config } from '../config.js'
import { asyncHandler } from '../utils/async-handler.js'
import { fail, ok } from '../utils/response.js'

const DEFAULT_AVATAR = '/static/avatar-default.png'
const DEFAULT_BALANCE = 568.5

const maskAccount = account =>
  typeof account === 'string' && account.length >= 11
    ? account.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    : account

export const userRoutes = router => {
  router.post(
    '/api/user/login',
    asyncHandler(async (req, res) => {
      const { account, password } = req.body || {}
      if (!account) return fail(res, 'account必填')

      const [rows] = await pool.query('SELECT * FROM users WHERE account = ? LIMIT 1', [account])
      let user = rows[0]

      if (!user) {
        const nickname = maskAccount(account) || '团购用户'
        const passwordHash = password ? await bcrypt.hash(String(password), 10) : ''
        const [ret] = await pool.query(
          'INSERT INTO users(account, password, nickname, avatar) VALUES(?,?,?,?)',
          [account, passwordHash, nickname, DEFAULT_AVATAR]
        )
        const userId = ret.insertId
        await pool.query('INSERT INTO wallets(user_id, balance) VALUES(?,?)', [userId, DEFAULT_BALANCE])
        user = { id: userId, account, nickname, avatar: DEFAULT_AVATAR }
      } else if (user.password && password) {
        const okPwd = await bcrypt.compare(String(password), String(user.password))
        if (!okPwd) return fail(res, '账号或密码错误', -1, 401)
      } else if (user.password && !password) {
        return fail(res, '请输入密码', -1, 400)
      }

      const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: '7d' })
      const [[wallet]] = await pool.query('SELECT balance FROM wallets WHERE user_id = ? LIMIT 1', [user.id])

      return ok(res, {
        token,
        id: user.id,
        account: user.account,
        nickname: user.nickname || maskAccount(user.account) || '团购用户',
        avatar: user.avatar || DEFAULT_AVATAR,
        balance: wallet ? Number(wallet.balance) : 0
      })
    })
  )

  router.get(
    '/api/user/profile',
    asyncHandler(async (req, res) => {
      const header = req.headers.authorization || ''
      const match = header.match(/^Bearer\s+(.+)$/i)
      const token = match ? match[1] : null
      if (!token) return fail(res, '未登录', 401, 401)

      let payload
      try {
        payload = jwt.verify(token, config.jwtSecret)
      } catch {
        return fail(res, '登录已过期', 401, 401)
      }

      const userId = payload.id
      const [[user]] = await pool.query(
        'SELECT id, account, nickname, avatar, create_time FROM users WHERE id = ? LIMIT 1',
        [userId]
      )
      if (!user) return fail(res, '用户不存在', 404, 404)

      const [[wallet]] = await pool.query('SELECT balance FROM wallets WHERE user_id = ? LIMIT 1', [userId])

      return ok(res, {
        id: user.id,
        account: user.account,
        nickname: user.nickname,
        avatar: user.avatar,
        create_time: user.create_time,
        balance: wallet ? Number(wallet.balance) : 0
      })
    })
  )
}

