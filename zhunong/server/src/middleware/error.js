import { fail } from '../utils/response.js'

export const notFound = (req, res) => fail(res, 'Not Found', 404, 404)

export const errorHandler = (err, req, res, next) => {
  const message = err?.message || 'Server Error'
  console.error(err)
  return fail(res, message, 500, 500)
}

