const express = require('express')

const assets = require('./middlewares/assets')
const render = require('./handlers/render')

const app = express()

let buildFolder

if (process.env.NODE_ENV === 'production') {
  buildFolder = 'build'
} else {
  buildFolder = '.dev-build'
}

app.use(express.static('public'))
app.use(assets('client', buildFolder))
app.use(assets('server', '.server-build', false))

app.get('/*', render)

module.exports = app
