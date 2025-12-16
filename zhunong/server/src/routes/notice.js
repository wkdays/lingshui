import { pool } from '../db/pool.js'
import { asyncHandler } from '../utils/async-handler.js'
import { ok } from '../utils/response.js'

export const noticeRoutes = router => {
  router.get(
    '/api/notice/list',
    asyncHandler(async (req, res) => {
      const [rows] = await pool.query(
        'SELECT id, title, content, create_time FROM notices WHERE status = 1 ORDER BY id DESC'
      )
      return ok(
        res,
        rows.map(r => ({
          id: r.id,
          title: r.title,
          content: r.content,
          time: r.create_time
        }))
      )
    })
  )
}

