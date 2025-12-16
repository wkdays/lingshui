import { pool } from '../db/pool.js'
import { asyncHandler } from '../utils/async-handler.js'
import { fail, ok } from '../utils/response.js'
import { generateOrderNo, ORDER_STATUS } from '../utils/order.js'
import { triggerPrint } from '../utils/printer.js'

const toMoney = v => Number(Number(v || 0).toFixed(2))
const parseJson = value => {
  if (!value) return null
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export const orderRoutes = router => {
  router.post(
    '/api/order/create',
    asyncHandler(async (req, res) => {
      const userId = req.user.id
      const goods = Array.isArray(req.body?.goods) ? req.body.goods : []
      const deliveryType = Number(req.body?.deliveryType || 1)
      const address = req.body?.address || null
      const pickup = req.body?.pickup || null
      const station = req.body?.station || null

      if (!goods.length) return fail(res, 'goods不能为空')

      const totalAmount = toMoney(goods.reduce((sum, g) => sum + Number(g.price || 0) * Number(g.count || 0), 0))
      const orderNo = generateOrderNo()
      const deliveryInfo = { address, pickup, station }

      const connection = await pool.getConnection()
      try {
        await connection.beginTransaction()
        const [ret] = await connection.query(
          'INSERT INTO orders(user_id, order_no, total_amount, pay_amount, delivery_type, delivery_info, status) VALUES(?,?,?,?,?,?,?)',
          [userId, orderNo, totalAmount, totalAmount, deliveryType, JSON.stringify(deliveryInfo), 1]
        )
        const orderId = ret.insertId

        for (const item of goods) {
          const productId = Number(item.goodsId || item.id || 0)
          const productName = String(item.name || '')
          const imageUrl = String(item.image || '')
          const price = toMoney(item.price)
          const quantity = Number(item.count || 1)
          const specs = item.specs ? String(item.specs) : null
          await connection.query(
            'INSERT INTO order_items(order_id, product_id, product_name, image_url, price, quantity, specs) VALUES(?,?,?,?,?,?,?)',
            [orderId, productId, productName, imageUrl, price, quantity, specs]
          )
        }

        await connection.commit()

        await triggerPrint({ orderNo })
        return ok(res, { orderId: orderNo })
      } catch (e) {
        await connection.rollback()
        throw e
      } finally {
        connection.release()
      }
    })
  )

  router.post(
    '/api/order/pay',
    asyncHandler(async (req, res) => {
      const userId = req.user.id
      const orderNo = String(req.body?.orderId || '')
      const payType = String(req.body?.payType || 'balance')
      if (!orderNo) return fail(res, 'orderId必填')

      const [[order]] = await pool.query(
        'SELECT id, user_id, pay_amount, status FROM orders WHERE order_no = ? LIMIT 1',
        [orderNo]
      )
      if (!order || order.user_id !== userId) return fail(res, '订单不存在', 404, 404)
      if (order.status !== 1) return fail(res, '订单状态不可支付')

      if (payType === 'balance') {
        const [[wallet]] = await pool.query('SELECT balance FROM wallets WHERE user_id = ? LIMIT 1', [userId])
        const balance = wallet ? Number(wallet.balance) : 0
        const need = Number(order.pay_amount)
        if (balance < need) return fail(res, '余额不足', -1, 400)

        const connection = await pool.getConnection()
        try {
          await connection.beginTransaction()
          await connection.query('UPDATE wallets SET balance = balance - ? WHERE user_id = ?', [need, userId])
          await connection.query(
            'INSERT INTO transactions(user_id, type, amount, order_id, merchant_name) VALUES(?,?,?,?,?)',
            [userId, 'consume', -need, order.id, null]
          )
          await connection.query('UPDATE orders SET status = 2, pay_time = NOW() WHERE id = ?', [order.id])
          await connection.commit()
        } catch (e) {
          await connection.rollback()
          throw e
        } finally {
          connection.release()
        }
      } else {
        await pool.query('UPDATE orders SET status = 2, pay_time = NOW() WHERE id = ?', [order.id])
      }

      const [[wallet2]] = await pool.query('SELECT balance FROM wallets WHERE user_id = ? LIMIT 1', [userId])
      return ok(res, { balance: wallet2 ? Number(wallet2.balance) : 0 })
    })
  )

  router.post(
    '/api/order/cancel',
    asyncHandler(async (req, res) => {
      const userId = req.user.id
      const orderNo = String(req.body?.orderId || '')
      if (!orderNo) return fail(res, 'orderId必填')

      const [[order]] = await pool.query(
        'SELECT id, user_id, status FROM orders WHERE order_no = ? LIMIT 1',
        [orderNo]
      )
      if (!order || order.user_id !== userId) return fail(res, '订单不存在', 404, 404)
      if (order.status !== 1) return fail(res, '当前订单不可取消')

      await pool.query('UPDATE orders SET status = 6 WHERE id = ?', [order.id])
      return ok(res, null, '已取消')
    })
  )

  router.get(
    '/api/order/list',
    asyncHandler(async (req, res) => {
      const userId = req.user.id
      const status = req.query?.status ? Number(req.query.status) : null

      const params = [userId]
      let sql = 'SELECT id, order_no, total_amount, pay_amount, delivery_type, delivery_info, status, create_time, pay_time FROM orders WHERE user_id = ?'
      if (status) {
        sql += ' AND status = ?'
        params.push(status)
      }
      sql += ' ORDER BY id DESC'

      const [orders] = await pool.query(sql, params)
      if (!orders.length) return ok(res, [])

      const orderIds = orders.map(o => o.id)
      const [items] = await pool.query(
        `SELECT id, order_id, product_id, product_name, image_url, price, quantity, specs FROM order_items WHERE order_id IN (${orderIds
          .map(() => '?')
          .join(',')})`,
        orderIds
      )
      const itemsByOrder = new Map()
      for (const it of items) {
        const list = itemsByOrder.get(it.order_id) || []
        list.push(it)
        itemsByOrder.set(it.order_id, list)
      }

      const list = orders.map(o => ({
        id: o.order_no,
        status: o.status,
        statusText: ORDER_STATUS[o.status] || '',
        createTime: o.create_time,
        payTime: o.pay_time,
        totalPrice: Number(o.total_amount),
        deliveryType: o.delivery_type,
        deliveryInfo: parseJson(o.delivery_info),
        goods: (itemsByOrder.get(o.id) || []).map(it => ({
          id: it.product_id,
          goodsId: it.product_id,
          name: it.product_name,
          image: it.image_url,
          price: Number(it.price),
          count: it.quantity,
          specs: it.specs || ''
        }))
      }))

      return ok(res, list)
    })
  )

  router.get(
    '/api/order/detail/:id',
    asyncHandler(async (req, res) => {
      const userId = req.user.id
      const orderNo = String(req.params.id || '')
      const [[order]] = await pool.query(
        'SELECT id, user_id, order_no, total_amount, pay_amount, delivery_type, delivery_info, status, create_time, pay_time FROM orders WHERE order_no = ? LIMIT 1',
        [orderNo]
      )
      if (!order || order.user_id !== userId) return fail(res, '订单不存在', 404, 404)

      const [items] = await pool.query(
        'SELECT id, product_id, product_name, image_url, price, quantity, specs FROM order_items WHERE order_id = ? ORDER BY id ASC',
        [order.id]
      )

      return ok(res, {
        id: order.order_no,
        status: order.status,
        statusText: ORDER_STATUS[order.status] || '',
        createTime: order.create_time,
        payTime: order.pay_time,
        totalPrice: Number(order.total_amount),
        deliveryType: order.delivery_type,
        deliveryInfo: parseJson(order.delivery_info),
        goods: items.map(it => ({
          id: it.product_id,
          goodsId: it.product_id,
          name: it.product_name,
          image: it.image_url,
          price: Number(it.price),
          count: it.quantity,
          specs: it.specs || ''
        }))
      })
    })
  )
}
