const express = require('express')

const { clientStatic, appDistPublic } = require('../config/paths')

const render = require('./handlers/render')

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use('/', express.static('public'))
} else {
  app.use('/', express.static(appDistPublic))
}

app.use('/static', express.static(clientStatic))

app.get('/*', render)

module.exports = app
