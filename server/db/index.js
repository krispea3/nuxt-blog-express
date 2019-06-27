const promise = require('bluebird');
const options = {
  // Initialization Options
  promiseLib: promise
};
const pgp = require('pg-promise')(options);

const cn = 'postgres://chris:phils33@localhost:5432/blog';
const db = pgp(cn); // database instance;

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
      if (data.password != req.body.password) {
        res.status(401)
        return res.send('Invalid password')
      } else {
        delete data['password']
        // Pseudo token. HAS TO BE CHANGED
        data.idToken = '123456'
        return (
          res.status(202).json({
            status: 'success',
            user: data,
            message: 'Retrieved user'
          })
        )
      }
    })
    .catch(err => {
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
      db.one('INSERT INTO users(firstname, surname, email, password) VALUES(${firstname}, ${surname}, ${email}, ${password}) RETURNING _id', req.body)
        .then((data) => {
          return (
            res.status(200).json({
              status: 'Success',
              userid: data._id,
              message: 'User added'
            })
          )
        })
        .catch(err => {
          console.error(err)
          return next(err)
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
  db.any('SELECT * FROM posts', [true])
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
  db.one('SELECT * FROM posts WHERE _id=${id}', req.params)
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
  db.one('INSERT INTO posts(title, description, content, imgurl, imgalt, userid) VALUES(${title}, ${description}, ${content}, ${imgurl}, ${imgalt}, ${userid}) RETURNING _id', req.body)
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
  console.log(req.body)
  db.none('UPDATE posts SET title=${title}, description=${description}, content=${content}, imgurl=${imgurl}, imgalt=${imgalt}, updated=${updated} WHERE _id=${_id}', req.body)
    .then(() => {
      console.log('Post updated')
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

module.exports = {
  getUsers,
  login,
  getUser,
  addUser,
  updateUser,
  getPosts,
  getPost,
  addPost,
  updatePost
}
