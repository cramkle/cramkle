const express = require('express')

const { appDevBuild, appBuild, appServerBuild } = require('../config/paths')

const assets = require('./middlewares/assets')
const render = require('./handlers/render')

const app = express()

let buildFolder

if (process.env.NODE_ENV === 'production') {
  buildFolder = appBuild
} else {
  buildFolder = appDevBuild
}

app.use(express.static('public'))
app.use(assets('client', buildFolder))
app.use(assets('server', appServerBuild, false))

app.get('/*', render)

module.exports = app
