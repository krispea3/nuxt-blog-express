const promise = require('bluebird');
const options = {
  // Initialization Options
  promiseLib: promise
};
const pgp = require('pg-promise')(options);

const cn = 'postgres://chris:phils33@localhost:5432/blog';
const db = pgp(cn); // database instance;


const getUsers = (req, res, next) => {
  db.any('SELECT * FROM users', [true])
    .then(data => {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Retrieved ALL users'
      })
    })
    .catch(error => {
      return next(error)
    });
}

const getPosts = (req, res, next) => {
  db.any('SELECT * FROM posts', [true])
    .then(data => {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Retrieved ALL posts'
      })
    })
    .catch(error => {
      return next(error)
    });
}

module.exports = {
  getUsers,
  getPosts
}
