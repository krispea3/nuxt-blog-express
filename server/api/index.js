const express = require('express')
const db = require('../db/index')

const router = express.Router()

// Routing
router.post('/track-data', (req, res) => {
  console.log('stored data', req.body.data)
  res.status(200).json({message: 'Success'})
})
// Users
router.get('/users', db.getUsers)
router.get('/user', db.getUser)
router.post('/user', db.addUser)
// Posts
router.get('/posts', db.getPosts)
router.post('/posts', db.addPost)

module.exports = {
  path: '/api',
  handler: router
}