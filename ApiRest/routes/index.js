const express = require('express');
const app = express()
const user = require('./usuario.js')
const driver = require('./conductor.js')
const profile = require('./profile.js')
const favoritos = require('./favoritos.js')
const taxis = require('./taxis.js')
app.use('/user',user)
app.use('/driver',driver)
app.use('/profile',profile)
app.use('/favorito',favoritos)
app.use('/taxis',taxis)
module.exports = app;
