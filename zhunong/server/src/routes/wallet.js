import { pool } from '../db/pool.js'
import { asyncHandler } from '../utils/async-handler.js'
import { fail, ok } from '../utils/response.js'

export const walletRoutes = router => {
  router.get(
    '/api/wallet/balance',
    asyncHandler(async (req, res) => {
      const userId = req.user.id
      const [[wallet]] = await pool.query('SELECT balance FROM wallets WHERE user_id = ? LIMIT 1', [userId])
      return ok(res, { balance: wallet ? Number(wallet.balance) : 0 })
    })
  )

  router.post(
    '/api/wallet/recharge',
    asyncHandler(async (req, res) => {
      const userId = req.user.id
      const amount = Number(req.body?.amount)
      if (!amount || amount <= 0) return fail(res, 'amount必须为正数')

      await pool.query('UPDATE wallets SET balance = balance + ? WHERE user_id = ?', [amount, userId])
      await pool.query(
        'INSERT INTO transactions(user_id, type, amount, order_id, merchant_name) VALUES(?,?,?,?,?)',
        [userId, 'recharge', amount, null, null]
      )

      const [[wallet]] = await pool.query('SELECT balance FROM wallets WHERE user_id = ? LIMIT 1', [userId])
      return ok(res, { balance: wallet ? Number(wallet.balance) : 0 })
    })
  )

  router.get(
    '/api/wallet/transactions',
    asyncHandler(async (req, res) => {
      const userId = req.user.id
      const [rows] = await pool.query(
        `SELECT t.id, t.type, t.amount, o.order_no, t.create_time
         FROM transactions t
         LEFT JOIN orders o ON o.id = t.order_id
         WHERE t.user_id = ?
         ORDER BY t.id DESC
         LIMIT 100`,
        [userId]
      )

      const titleByType = {
        recharge: '余额充值',
        consume: '购买商品'
      }

      const list = rows.map(r => ({
        id: r.id,
        type: r.type,
        title: titleByType[r.type] || r.type,
        amount: Number(r.amount),
        orderNo: r.order_no || '',
        time: r.create_time
      }))
      return ok(res, list)
    })
  )
}
