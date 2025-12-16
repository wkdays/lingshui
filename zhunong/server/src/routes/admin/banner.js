import { pool } from '../../db/pool.js'
import { asyncHandler } from '../../utils/async-handler.js'
import { fail, ok } from '../../utils/response.js'

export const adminBannerRoutes = router => {
  router.get(
    '/api/admin/banner/list',
    asyncHandler(async (req, res) => {
      const status = req.query?.status ? Number(req.query.status) : null
      const params = []
      let sql = 'SELECT id, image_url, title, link_url, sort, status, create_time FROM banners'
      if (status === 0 || status === 1) {
        sql += ' WHERE status = ?'
        params.push(status)
      }
      sql += ' ORDER BY sort DESC, id DESC'
      const [rows] = await pool.query(sql, params)
      return ok(res, rows)
    })
  )

  router.post(
    '/api/admin/banner/add',
    asyncHandler(async (req, res) => {
      const { image_url, title = '', link_url = '', sort = 0, status = 1 } = req.body || {}
      if (!image_url) return fail(res, 'image_url必填')
      const [ret] = await pool.query(
        'INSERT INTO banners(image_url, title, link_url, sort, status) VALUES(?,?,?,?,?)',
        [image_url, title, link_url, Number(sort) || 0, Number(status) ? 1 : 0]
      )
      return ok(res, { id: ret.insertId })
    })
  )

  router.put(
    '/api/admin/banner/update',
    asyncHandler(async (req, res) => {
      const { id, image_url, title, link_url, sort } = req.body || {}
      if (!id) return fail(res, 'id必填')
      const fields = []
      const params = []
      if (image_url !== undefined) {
        fields.push('image_url = ?')
        params.push(image_url)
      }
      if (title !== undefined) {
        fields.push('title = ?')
        params.push(title)
      }
      if (link_url !== undefined) {
        fields.push('link_url = ?')
        params.push(link_url)
      }
      if (sort !== undefined) {
        fields.push('sort = ?')
        params.push(Number(sort) || 0)
      }
      if (!fields.length) return ok(res, null, 'no changes')
      params.push(id)
      await pool.query(`UPDATE banners SET ${fields.join(', ')} WHERE id = ?`, params)
      return ok(res, null, 'updated')
    })
  )

  router.delete(
    '/api/admin/banner/delete',
    asyncHandler(async (req, res) => {
      const id = Number(req.query?.id)
      if (!id) return fail(res, 'id必填')
      await pool.query('DELETE FROM banners WHERE id = ?', [id])
      return ok(res, null, 'deleted')
    })
  )

  router.put(
    '/api/admin/banner/status',
    asyncHandler(async (req, res) => {
      const { id, status } = req.body || {}
      if (!id) return fail(res, 'id必填')
      await pool.query('UPDATE banners SET status = ? WHERE id = ?', [Number(status) ? 1 : 0, id])
      return ok(res, null, 'updated')
    })
  )
}

