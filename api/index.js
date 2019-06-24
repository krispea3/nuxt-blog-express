
const express = require('express')

// Create express instance
const app = express()

const router = express.Router()
// Definition required to correctly handle requests and response
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

router.post('/track-data', (req, res) => {
  console.log('stored data', req.body.data)
  res.status(200).json({message: 'Success'})
})

module.exports = {
  path: '/api',
  handler: router
}