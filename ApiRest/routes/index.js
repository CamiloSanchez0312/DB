const express = require('express');
const app = express()
const usuario = require('./usuario.js')
const conductor = require('./conductor.js')

app.use('/usuario',usuario)
app.use('/conductor',conductor)

module.exports = app;
