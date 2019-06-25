const express = require('express')
const db = require('../db/index')

const router = express.Router()

// Routing
router.post('/track-data', (req, res) => {
  console.log('stored data', req.body.data)
  res.status(200).json({message: 'Success'})
})

router.get('/users', db.getUsers)
router.get('/posts', db.getPosts)

module.exports = {
  path: '/api',
  handler: router
}