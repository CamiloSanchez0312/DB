const {Pool} = require('pg')

const pool = new Pool({
  user:'juancamilo',
  host:'localhost',
  database:'taxi',
  password:'password',
  port:5433
})
console.log('Conectado a la base de datos')
module.exports = pool;
