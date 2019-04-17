const {Pool} = require('pg')

const pool = new Pool({
  user:'juancamilo',
  host:'localhost',
  database:'taxi',
  password:'24880312',
  port:5432
})
console.log('Conectado a la base de datos')
module.exports = pool;
