const promise = require('bluebird');
const sharp = require('sharp')
const connection = require('./.config');
const options = {
  // Initialization Options
  promiseLib: promise
};
const pgp = require('pg-promise')(options);
const  jwt  =  require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Datauri = require('datauri')
const cloudinary = require('cloudinary').v2;

const SECRET_KEY = 'secretkey050440';
const saltRounds = 10;

// const CLOUDINARY_URL='cloudinary://922781415854575:zcBkJhV1udfKRtYX1dDkZmhw6Yk@dipnvheby'
cloudinary.config({ 
  cloud_name: 'dipnvheby', 
  api_key: '922781415854575', 
  api_secret: 'zcBkJhV1udfKRtYX1dDkZmhw6Yk' 
});

const db = pgp(connection.cn); // database instance;

// const uploadImage = (image) => {
//   let dUri = new Datauri()
//   dUri.format(path.extname(image.originalname).toString(),image.buffer);
//   cloudinary.uploader.upload(dUri.content, (error, result) => {
//     console.log('cloudinary result: ',result)
//     console.log('cludinary error: ', error)
//   });
// }
// const resizeImage = (path, file) =>  {
//   // Resize to height 432 for card display
//   sharp(path)
//       .resize(648, 432)
//       .toFile('server/api/uploads/images/height_432/' + file, (error, info) => {
//         if (error) {
//           console.error(error)
//           return new Error('Error resizing image (sharp)')
//         }
//       })
//   // Resize to tumbnails 100X100
//   sharp(path)
//       .resize(100, 100)
//       .toFile('server/api/uploads/images/thumbnails/' + file, (error, info) => {
//         if (error) {
//           console.error(error)
//           return new Error('Error resizing image (sharp)')
//         }
//       })
// }
// Users
const getUsers = (req, res, next) => {
  db.any('SELECT * FROM users', [true])
    .then(data => {
      return (
        res.status(200).json({
          status: 'success',
          users: data,
          message: 'Retrieved ALL users'
        })
      )
    })
    .catch(error => {
      return next(error)
    });
}

const getUser = (req, res, next) => {
  db.one('SELECT * FROM users WHERE _id=${id}', req.params)
    .then(data => {
      delete data['password']
      data.idToken = "123456"
      res.status(200).json({
        status: 'success',
        user: data,
        message: 'User retrieved'
      })
    })
    .catch(err => {
      console.error(err)
      return next(err)
    })
}

const login = (req, res, next) => {
  db.one('SELECT * FROM users WHERE email=${email}', req.body)
    .then(data => {
      bcrypt.compare(req.body.password, data.password, function(err, response) {
        if (response == true)  {
          delete data['password']
          // Generate JWT
          const  expiresIn  =  3600;
          const  accessToken  =  jwt.sign(
            {id:  data._id}, 
            SECRET_KEY,
            {expiresIn:  expiresIn}
          );

          data.idToken = accessToken
          return (
            res.status(202).json({
              status: 'success',
              user: data,
              token: accessToken,
              expiresIn: expiresIn,
              message: 'Retrieved user'
            })
          )
        } else {
          res.status(401)
          return res.send('Invalid password')
        }
      })
    })
    .catch(err => {
      console.error(err)
      return next(err)
    });
}

const addUser = (req, res, next) => {
  // Field validation
  if (req.body.firstname === "" | req.body.surname === "" | req.body.email === "" | req.body.password === "") {
    res.status(403)
    return res.send('All fields are required')
    // throw new Error('All fields are required')
  }
  if (req.body.password.length < 8) {
    res.status(403)
    return res.send('Password must be at least 8 chars')
  }
  // Check if email already in use
  db.any('SELECT email FROM users WHERE email=${email}', req.body)
    .then(data => {
      // Send error response if email in use
      if (data.length > 0) {
        res.status(403)
        return res.send('Email already registered')
      }
      // Add User if email not in use
        // Hash password
      hash = bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        req.body.password = hash
        db.one('INSERT INTO users(firstname, surname, email, password) VALUES(${firstname}, ${surname}, ${email}, ${password}) RETURNING _id', req.body)
        .then((data) => {
          // Generate JWT
          const  expiresIn  =  3600;
          const  accessToken  =  jwt.sign(
            {id:  data._id}, 
            SECRET_KEY,
            {expiresIn:  expiresIn}
          );

          return (
            res.status(200).json({
              status: 'Success',
              userid: data._id,
              token: accessToken,
              expiresIn: expiresIn,
              message: 'User added'
            })
          )
        })
        .catch(err => {
          console.error(err)
          return next(err)
        })

      })
      return null
    })
    .catch(err => {
      return next(err)
    })
}

const updateUser = (req, res, next) => {
  db.none('UPDATE users SET firstname=${firstname}, surname=${surname}, updated=${updated} WHERE _id=${_id}', req.body)
    .then(() => {
      res.status(202).json({
        status: 'success',
        message: 'user updated'
      })
    })
    .catch(err => {
      console.error(err)
      return next(err)
    })
}

// Posts
const getPosts = (req, res, next) => {
  db.any('SELECT posts._id, posts.title, posts.description, posts.content, posts.img_url, posts.img_name, posts.img_original_name, posts.imgalt, posts.draft, posts.published, posts.userid, posts.created, posts.updated, users.firstname, users.surname FROM posts, users WHERE posts.userid = users._id', [true])
    .then(data => {
      return (
        res.status(200).json({
          status: 'success',
          posts: data,
          message: 'Retrieved ALL posts'
        })
      )
    })
    .catch(error => {
      return next(error)
    })
}

const getPost = (req, res, next) => {
  db.one('SELECT posts._id, posts.title, posts.description, posts.content, posts.img_url, posts.img_name, posts.img_original_name, posts.imgalt, posts.draft, posts.published, posts.userid, posts.created, posts.updated, users.firstname, users.surname FROM posts, users WHERE posts._id=${id} AND posts.userid = users._id', req.params)
    .then(data => {
      res.status(200).json({
        status: 'success',
        post: data,
        message: 'Retrieved post'
      })
    })
    .catch(err => {
      console.error(err)
      return next(err)
    })
}

const addPost = (req, res, next) => {
  if (req.file) {
    // resizeImage(req.file.path, req.file.filename)
    let dUri = new Datauri()
    dUri.format(req.file.originalname, req.file.buffer)
    cloudinary.uploader.upload(dUri.content, function(error, result) {
      if (!error) {
        req.file.filename = result.public_id
        req.file.img_url = result.url
        db.one('INSERT INTO posts(title, description, content, img_url, img_name, img_original_name, imgalt, draft, published, userid) VALUES(${body.title}, ${body.description}, ${body.content}, ${file.img_url}, ${file.filename}, ${file.originalname}, ${body.imgalt}, ${body.draft}, ${body.published}, ${body.userid}) RETURNING _id, created', req)
          .then((data) => {
            return (
              res.status(200).json({
                status: 'success',
                post: {id: data._id, created: data.created},
                file: {url: req.file.img_url, name: req.file.filename, originalName: req.file.originalname},
                message: 'Post added'
              })
            )
          })
          .catch(err => {
            console.error(err)
            return next(err)
          });
      } else {
        console.log('cludinary error: ', error)
      }
    })
  } else {
    req.body.img_url = ''
    req.body.img_name = ''
    req.body.img_original_name = ''
    req.body.imgalt = ''
    db.one('INSERT INTO posts(title, description, content, img_url, img_name, img_original_name, imgalt, draft, published, userid) VALUES(${body.title}, ${body.description}, ${body.content}, ${body.img_url}, ${body.img_name}, ${body.img_original_name}, ${body.imgalt}, ${body.draft}, ${body.published}, ${body.userid}) RETURNING _id, created', req)
      .then((data) => {
        return (
          res.status(200).json({
            status: 'success',
            post: {id: data._id, created: data.created},
            file: { url: req.body.img_url, name: req.body.filename, originalName: req.body.originalname},
            message: 'Post added'
          })
        )
      })
      .catch(err => {
        console.error(err)
        return next(err)
      });
  }
}

const updatePost = (req, res, next) => {
  req.body.updated = new Date()
  if (req.body.img_name != '' & req.file != null) {
    // Delete old file on cloudinary
    cloudinary.uploader.destroy(req.body.img_name, function(result) { 
      console.log(result)
    })
  }         
  if (req.file) {
    // Upload new file to cloudinary
    let dUri = new Datauri()
    dUri.format(req.file.originalname, req.file.buffer)
    cloudinary.uploader.upload(dUri.content, function(error, result) {
      if (!error) {
        req.file.img_url = result.url
        req.file.filename = result.public_id
        db.none('UPDATE posts SET title=${body.title}, description=${body.description}, content=${body.content}, img_url=${file.img_url}, img_name=${file.filename}, img_original_name=${file.originalname}, imgalt=${body.imgalt}, draft=${body.draft}, published=${body.published}, updated=${body.updated} WHERE _id=${params.id}', req)
          .then(() => {
            res.status(202).json({
              status: 'success',
              post: {updated: req.body.updated},
              file: {url: req.file.img_url, name: req.file.filename, originalName: req.file.originalname},
              message: 'Post updated'
            })
          })
          .catch(err => {
            console.error(err)
            return next(err)
          })
      } else {
        console.log(error)
      }
    })    
    // resizeImage(req.file.path, req.file.filename)
  } else {
    console.log(req.body)
    db.none('UPDATE posts SET title=${body.title}, description=${body.description}, content=${body.content}, imgalt=${body.imgalt}, draft=${body.draft}, published=${body.published}, updated=${body.updated} WHERE _id=${params.id}', req)
    .then(() => {
      res.status(202).json({
        status: 'success',
        post: {updated: req.body.updated},
        file: {url: req.body.img_url, name: req.body.img_name, originalName: req.body.img_original_name},
        message: 'Post updated'
      })
    })
    .catch(err => {
      console.error(err)
      return next(err)
    })
  }
}

const deletePost = (req, res, next) => {
  console.log(req.query.image)
  if (req.query.image != '') {
    // Delete image on cloudinary
    cloudinary.uploader.destroy(req.query.image, function(result) {
    db.none('DELETE FROM posts WHERE _id=${id}', req.params)
      .then(() => {
        res.status(200).json({
          status: 'succesful',
          message: 'Post deleted'
        })
      })
      .catch(err => {
        console.error(err)
        return next(err)
      })
  })
  } else {
    db.none('DELETE FROM posts WHERE _id=${id}', req.params)
      .then(() => {
        res.status(200).json({
          status: 'succesful',
          message: 'Post deleted'
        })
      })
      .catch(err => {
        console.error(err)
        return next(err)
      })
  }
}

const removeImage = (req, res, next) => {
  // Delete image on cloudinary
  cloudinary.uploader.destroy(req.body.image, function(result) {
    const image = {
      img_url: '',
      img_name: '',
      img_original_name: '',
      imgalt: ''
    }
    req.image = image
    db.none('UPDATE posts SET img_url=${image.img_url}, img_name=${image.img_name}, img_original_name=${image.img_original_name}, imgalt=${image.imgalt} WHERE _id=${params.id}', req)
      .then(() => {
        res.status(200).json({
          status: 'succesful',
          message: 'Image deleted'
        })
      })
      .catch(err => {
        console.error(err)
        return next(err)
      })
  })
}

module.exports = {
  getUsers,
  login,
  getUser,
  addUser,
  updateUser,
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
  removeImage
}
