const express = require('express');
const app = express()
const user = require('./usuario.js')
const driver = require('./conductor.js')

app.use('/user',user)
app.use('/driver',driver)

module.exports = app;
