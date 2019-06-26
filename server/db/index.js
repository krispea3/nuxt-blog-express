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
  db.one('SELECT * FROM users WHERE email=${email}', req.headers)
    .then(data => {
      if (data.password != req.headers.password) {
        res.status(401)
        return res.send('Invalid password')
      } else {
        delete data['password']
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
  if (req.body.firstName === "" | req.body.surName === "" | req.body.email === "" | req.body.password === "") {
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
      db.none('INSERT INTO users(firstname, surname, email, password) VALUES(${firstName}, ${surName}, ${email}, ${password})', req.body)
        .then(() => {
          return (
            res.status(200).json({
              status: 'Success',
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

const addPost = (req, res, next) => {
  console.log(req.body)
  db.none('INSERT INTO posts(title, description, user_id) VALUES(${title}, ${description}, 1)', req.body)
    .then(() => {
      return (
        res.status(200).json({
          status: 'success',
          message: 'Post added'
        })
      )
    })
    .catch(error => {
      console.log('Error insert row')
      return next(error)
    });
}

module.exports = {
  getUsers,
  getUser,
  addUser,
  getPosts,
  addPost
}
