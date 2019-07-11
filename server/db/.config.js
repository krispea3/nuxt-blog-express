module.exports = {
  cn: process.env.NODE_ENV === 'development' ?'postgres://chris:phils33@localhost:5432/blog' :process.env.DATABASE_URL+'?ssl=true',
}