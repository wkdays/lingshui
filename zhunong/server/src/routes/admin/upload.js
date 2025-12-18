import crypto from 'crypto'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { asyncHandler } from '../../utils/async-handler.js'
import { fail, ok } from '../../utils/response.js'

const mimeToExt = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif'
}

const parseDataUrl = dataUrl => {
  if (typeof dataUrl !== 'string') return null
  const match = dataUrl.match(/^data:([\w/+.-]+);base64,(.+)$/)
  if (!match) return null
  return { mime: match[1], base64: match[2] }
}

export const adminUploadRoutes = router => {
  router.post(
    '/api/admin/upload/image',
    asyncHandler(async (req, res) => {
      const dataUrl = req.body?.dataUrl
      const originalName = String(req.body?.filename || '')

      const parsed = parseDataUrl(dataUrl)
      if (!parsed) return fail(res, 'dataUrl格式错误')

      const ext = mimeToExt[parsed.mime]
      if (!ext) return fail(res, '仅支持 png/jpg/webp/gif')

      const buffer = Buffer.from(parsed.base64, 'base64')
      if (!buffer.length) return fail(res, '文件为空')
      if (buffer.length > 5 * 1024 * 1024) return fail(res, '文件过大（最大5MB）')

      const __filename = fileURLToPath(import.meta.url)
      const __dirname = path.dirname(__filename)
      const uploadDir = path.resolve(__dirname, '../../../../static/uploads')
      await fs.mkdir(uploadDir, { recursive: true })

      const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '')
      const base = crypto.randomBytes(16).toString('hex')
      const name = `${base}${safeName ? '_' + safeName : ''}`
      const fileName = name.endsWith('.' + ext) ? name : `${name}.${ext}`

      await fs.writeFile(path.join(uploadDir, fileName), buffer)

      return ok(res, { url: `/static/uploads/${fileName}` })
    })
  )
}
