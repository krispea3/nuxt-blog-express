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

const SECRET_KEY = 'secretkey050440';
const saltRounds = 10;

console.log('db connection: ', connection.cn)
const db = pgp(connection.cn); // database instance;

const resizeImage = (path, file) =>  {
  // Resize to height 432 for card display
  sharp(path)
      .resize(648, 432)
      .toFile('server/api/uploads/images/height_432/' + file, (error, info) => {
        if (error) {
          console.error(error)
          return new Error('Error resizing image (sharp)')
        }
      })
  // Resize to tumbnails 100X100
  sharp(path)
      .resize(100, 100)
      .toFile('server/api/uploads/images/thumbnails/' + file, (error, info) => {
        if (error) {
          console.error(error)
          return new Error('Error resizing image (sharp)')
        }
      })
}
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
      console.log('data from select users with email: ', data)
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
  db.any('SELECT posts._id, posts.title, posts.description, posts.content, posts.img_name, posts.img_original_name, posts.imgalt, posts.draft, posts.published, posts.userid, posts.created, posts.updated, users.firstname, users.surname FROM posts, users WHERE posts.userid = users._id', [true])
    .then(data => {
      res.statusCode = 200
      return res.json({
        status: 'success',
          posts: data,
          message: 'Retrieved ALL posts'
      })
    //   return (
    //     res.status(200).json({
    //       status: 'success',
    //       posts: data,
    //       message: 'Retrieved ALL posts'
    //     })
    //   )
    })
    .catch(error => {
      return next(error)
    })
}

const getPost = (req, res, next) => {
  db.one('SELECT posts._id, posts.title, posts.description, posts.content, posts.img_name, posts.img_original_name, posts.imgalt, posts.draft, posts.published, posts.userid, posts.created, posts.updated, users.firstname, users.surname FROM posts, users WHERE posts._id=${id} AND posts.userid = users._id', req.params)
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
    resizeImage(req.file.path, req.file.filename)
  } else {
    const file = {filename: '', originalname: ''}
    req.file = file
  }
  db.one('INSERT INTO posts(title, description, content, img_name, img_original_name, imgalt, draft, published, userid) VALUES(${body.title}, ${body.description}, ${body.content}, ${file.filename}, ${file.originalname}, ${body.imgalt}, ${body.draft}, ${body.published}, ${body.userid}) RETURNING _id, created', req)
    .then((data) => {
      return (
        res.status(200).json({
          status: 'success',
          post: {id: data._id, created: data.created},
          file: {name: req.file.filename, originalName: req.file.originalname},
          message: 'Post added'
        })
      )
    })
    .catch(err => {
      console.error(err)
      return next(err)
    });
}

const updatePost = (req, res, next) => {
  if (req.file) {
    resizeImage(req.file.path, req.file.filename)
  } else {
    const file = {filename: req.body.img_name, originalname: req.body.img_original_name}
    req.file = file
  }
  req.body.updated = new Date()
  db.none('UPDATE posts SET title=${body.title}, description=${body.description}, content=${body.content}, img_name=${file.filename}, img_original_name=${file.originalname}, imgalt=${body.imgalt}, draft=${body.draft}, published=${body.published}, updated=${body.updated} WHERE _id=${params.id}', req)
    .then(() => {
      res.status(202).json({
        status: 'success',
        post: {updated: req.body.updated},
        file: {name: req.file.filename, originalName: req.file.originalname},
        message: 'Post updated'
      })
    })
    .catch(err => {
      console.error(err)
      return next(err)
    })
}

const deletePost = (req, res, next) => {
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
}
