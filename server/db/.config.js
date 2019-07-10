module.exports = {
cn: process.env.NODE_ENV === 'development' 
  ?{
    host: 'localhost',
    port: 5432,
    database: 'blog',
    user: 'chris',
    password: 'phils33',
    ssl: false
  }
  :{
    host: 'ec2-46-137-91-216.eu-west-1.compute.amazonaws.com',
    port: 5432,
    database: 'delsekm4qmcdj5',
    user: 'oxclwkrrelxeix',
    password: '4ccce46828ad401b0a2f01a8caf467ad860b5d455d87133fca906ad20207b603',
    ssl: true
  }
}

// module.exports = {
//   cn: process.env.NODE_ENV === 'development' ?'postgres://chris:phils33@localhost:5432/blog' :{connectionString: process.env.DATABASE_URL,
//   ssl: true}
// }