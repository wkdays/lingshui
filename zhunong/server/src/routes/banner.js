import { pool } from '../db/pool.js'
import { asyncHandler } from '../utils/async-handler.js'
import { ok } from '../utils/response.js'

export const bannerRoutes = router => {
  router.get(
    '/api/banner/list',
    asyncHandler(async (req, res) => {
      const [rows] = await pool.query(
        'SELECT id, image_url, title, link_url, sort FROM banners WHERE status = 1 ORDER BY sort DESC, id DESC'
      )
      return ok(
        res,
        rows.map(r => ({
          id: r.id,
          image: r.image_url,
          title: r.title,
          link: r.link_url,
          sort: r.sort
        }))
      )
    })
  )
}

