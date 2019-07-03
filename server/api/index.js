const express = require('express')
const db = require('../db/index')
const multer  = require('multer')

const router = express.Router()

// Multer definition
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'server/api/uploads')
  },
  filename: function (req, file, cb) {
    console.log('filename file: ', file)
    const fileType = file.mimetype
    if (!fileType.includes('image')) {
      console.log('File type not image')
      cb(new Error('Invalid file type. File is not an image! (Accepted: jpg, jpeg, bmp, gif)'))
    }
    console.log('fileType: ', fileType)
    const ext = file.originalname.slice((file.originalname.lastIndexOf(".") - 1 >>> 0) + 2)
    console.log('extension: ', ext)
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'bmp' || ext === 'gif') {
      cb(null, file.fieldname + '-' + Date.now() + '.' + ext)
    } else {
      console.log('No Extension')
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
router.get('/image/:file', function(req, res, next) {
  console.log('req.params', req.params)
  console.log(__dirname + '/uploads/' + req.params.file)
  // res.set('Content-Type', 'image/jpeg')
  // res.sendFile(path.resolve(path.resolve(__dirname, '/uploads/' + req.params.file)))
  res.sendFile(__dirname + '/uploads/' + req.params.file), function(err) {
    console.log('res.headers inside sendFile: ', res.sentHeaders)
    console.log('error inside sendFile', err)
  }
})

module.exports = {
  path: '/api',
  handler: router
}