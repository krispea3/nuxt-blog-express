const promise = require('bluebird');
const connection = require('./.config');
const options = {
  // Initialization Options
  promiseLib: promise
};
const pgp = require('pg-promise')(options);
const  jwt  =  require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = "secretkey050440";
const saltRounds = 10;

// const cn = 'postgres://chris:phils33@localhost:5432/blog';
const db = pgp(connection.cn); // database instance;

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
  db.any('SELECT posts._id, posts.title, posts.description, posts.content, posts.imgurl, posts.img, posts.imgalt, posts.draft, posts.published, posts.userid, posts.created, posts.updated, users.firstname, users.surname FROM posts, users WHERE posts.userid = users._id', [true])
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
    });
}

const getPost = (req, res, next) => {
  db.one('SELECT posts._id, posts.title, posts.description, posts.content, posts.imgurl, posts.img, posts.imgalt, posts.draft, posts.published, posts.userid, posts.created, posts.updated, users.firstname, users.surname FROM posts, users WHERE posts._id=${id} AND posts.userid = users._id', req.params)
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
  db.one('INSERT INTO posts(title, description, content, imgurl, img, imgalt, draft, published, userid) VALUES(${body.title}, ${body.description}, ${body.content}, ${body.imgurl}, ${file.buffer}, ${body.imgalt}, ${body.draft}, ${body.published}, ${body.userid}) RETURNING _id', req)
    .then((data) => {
      return (
        res.status(200).json({
          status: 'success',
          postid: data._id,
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
  db.none('UPDATE posts SET title=${body.title}, description=${body.description}, content=${body.content}, imgurl=${body.imgurl}, img={file.buffer}, imgalt=${body.imgalt}, draft=${body.draft}, published=${body.published}, updated=${body.updated} WHERE _id=${_id}', req)
    .then(() => {
      res.status(202).json({
        status: 'success',
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
  deletePost
}
