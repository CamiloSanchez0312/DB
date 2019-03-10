const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const morgan = require('morgan');
const usuario = require('./routes/usuario.js')
const conductor = require('./routes/conductor.js')


//middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(morgan('dev'))

//routes
app.use('/usuario',usuario)
app.use('/conductor',conductor)
//archivos estaticos


//start server

app.listen(port, ()=>{
  console.log('Server is running on port '+port)
})
