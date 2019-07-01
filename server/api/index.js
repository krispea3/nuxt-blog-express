const express = require('express')
const db = require('../db/index')
const multer  = require('multer')

const router = express.Router()
const upload = multer()

// Routing
router.post('/track-data', (req, res) => {
  console.log('stored data', req.body.data)
  res.status(200).json({message: 'Success'})
})
// Users
router.get('/users', db.getUsers)
router.get('/user/:id', db.getUser)
router.post('/login', db.login)
router.post('/user', db.addUser)
router.put('/user', db.updateUser)
// Posts
router.get('/posts', db.getPosts)
router.get('/post/:id', db.getPost)
  // multipart request. Use multer to split fields into res.body and imageFile into res.file
router.post('/post', upload.single('img'), db.addPost)
router.put('/post/:id', upload.single('img'), db.updatePost)
router.delete('/post/:id', db.deletePost)

module.exports = {
  path: '/api',
  handler: router
}