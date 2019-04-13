const express = require('express');
const app = express()
const user = require('./usuario.js')
const driver = require('./conductor.js')
const profile = require('./profile.js')
const favoritos = require('./favoritos.js')
const servicio = require('./servicio.js')
const taxis = require('./taxis.js')
app.use('/user',user)
app.use('/driver',driver)
app.use('/profile',profile)
app.use('/favorito',favoritos)
app.use('/taxis',taxis)
app.use('/servicio',servicio)

module.exports = app;
