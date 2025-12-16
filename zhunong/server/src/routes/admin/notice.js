import { pool } from '../../db/pool.js'
import { asyncHandler } from '../../utils/async-handler.js'
import { fail, ok } from '../../utils/response.js'

export const adminNoticeRoutes = router => {
  router.get(
    '/api/admin/notice/list',
    asyncHandler(async (req, res) => {
      const status = req.query?.status ? Number(req.query.status) : null
      const params = []
      let sql = 'SELECT id, title, content, status, create_time FROM notices'
      if (status === 0 || status === 1) {
        sql += ' WHERE status = ?'
        params.push(status)
      }
      sql += ' ORDER BY id DESC'
      const [rows] = await pool.query(sql, params)
      return ok(res, rows)
    })
  )

  router.post(
    '/api/admin/notice/add',
    asyncHandler(async (req, res) => {
      const { title, content, status = 1 } = req.body || {}
      if (!title) return fail(res, 'title必填')
      if (!content) return fail(res, 'content必填')
      const [ret] = await pool.query('INSERT INTO notices(title, content, status) VALUES(?,?,?)', [
        title,
        content,
        Number(status) ? 1 : 0
      ])
      return ok(res, { id: ret.insertId })
    })
  )

  router.put(
    '/api/admin/notice/update',
    asyncHandler(async (req, res) => {
      const { id, title, content } = req.body || {}
      if (!id) return fail(res, 'id必填')
      const fields = []
      const params = []
      if (title !== undefined) {
        fields.push('title = ?')
        params.push(title)
      }
      if (content !== undefined) {
        fields.push('content = ?')
        params.push(content)
      }
      if (!fields.length) return ok(res, null, 'no changes')
      params.push(id)
      await pool.query(`UPDATE notices SET ${fields.join(', ')} WHERE id = ?`, params)
      return ok(res, null, 'updated')
    })
  )

  router.delete(
    '/api/admin/notice/delete',
    asyncHandler(async (req, res) => {
      const id = Number(req.query?.id)
      if (!id) return fail(res, 'id必填')
      await pool.query('DELETE FROM notices WHERE id = ?', [id])
      return ok(res, null, 'deleted')
    })
  )

  router.put(
    '/api/admin/notice/status',
    asyncHandler(async (req, res) => {
      const { id, status } = req.body || {}
      if (!id) return fail(res, 'id必填')
      await pool.query('UPDATE notices SET status = ? WHERE id = ?', [Number(status) ? 1 : 0, id])
      return ok(res, null, 'updated')
    })
  )
}

