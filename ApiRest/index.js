const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const morgan = require('morgan');
const rutas = require('./routes/index.js')


//config
app.set('port',process.env.PORT || 3000)

//middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(morgan('dev'))

//routes
app.use('/',rutas)
//archivos estaticos


//start server

app.listen(app.get('port'), ()=>{
  console.log('Server is running on port '+app.get('port'))
})
