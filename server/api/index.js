const express = require('express')
const db = require('../db/index')
const multer  = require('multer')
const fs = require('fs')
const qt = require('quickthumb')

const router = express.Router()

// Multer definition
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'server/api/uploads/images')
  },
  filename: function (req, file, cb) {
    const fileType = file.mimetype
    if (!fileType.includes('image')) {
      cb(new Error('Invalid file type. File is not an image! (Accepted: jpg, jpeg, bmp, gif)'))
    }
    const ext = file.originalname.slice((file.originalname.lastIndexOf(".") - 1 >>> 0) + 2)
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'bmp' || ext === 'gif') {
      const storeField = file.fieldname + '-' + Date.now() + '.' + ext
      cb(null, storeField)    
    } else {
      cb(new Error('Image has missing/invalid file extension (Accepted: jpg, jpeg, bmp, gif)'))
    }
  }
}) 
const upload = multer({ storage: storage })

// Routing //
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
router.post('/post', upload.single('img_upload'), db.addPost)
router.put('/post/:id', upload.single('img_upload'), db.updatePost)
router.delete('/post/:id', db.deletePost)
// Images
  // Get original image
router.get('/image/:file', function(req, res, next) {
  res.sendFile(__dirname + '/uploads/images/' + req.params.file), function(err) {
    if (err) {
      console.log('Error in sendFile image: ', err)
      throw new Error('Cannot find image')
    }
  }
})
  // Get thumbnail image
  router.get('/thumbnail/:file', function(req, res, next) {
    res.sendFile(__dirname + '/uploads/thumbnails/' + req.params.file), function(err) {
      if (err) {
        console.log('Error in sendFile image: ', err)
        throw new Error('Cannot find thumbnail')
      }
    }
  })
  
router.delete('/image/:name', function(req,res) {
  // Delete image from server
  fs.unlink(__dirname + '/uploads/images/' + req.params.name, function(err) {
    if (err) {
      if (err.code === 'ENOENT') {
        return console.log('Image not found')
      }
    } else {
      res.status(200)
      res.send('Image deleted')
    }
  })
  // Delete thumbnail from server
  fs.unlink(__dirname + '/uploads/thumbnails/' + req.params.name, function(err) {
    if (err) {
      if (err.code === 'ENOENT') {
        return console.log('Tumbnail not found')
      }
    } else {
      res.status(200)
      res.send('Thumbnail deleted')
    }
  })

})

module.exports = {
  path: '/api',
  handler: router
}