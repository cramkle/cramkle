const express = require('express')

const { clientStatic, appDistPublic } = require('../config/paths')

const render = require('./handlers/render')

const app = express()

const publicRouteRegex = /^\/(public)?/

if (process.env.NODE_ENV === 'development') {
  app.use(publicRouteRegex, express.static('public'))
} else {
  app.use(publicRouteRegex, express.static(appDistPublic))
}

app.use('/static', express.static(clientStatic))

app.get('/*', render)

module.exports = app
