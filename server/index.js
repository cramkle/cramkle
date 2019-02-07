const express = require('express')

const { clientStatic } = require('../config/paths')

const render = require('./handlers/render')

const app = express()

app.use(express.static('public'))
app.use('/static', express.static(clientStatic))

app.get('/*', render)

module.exports = app
