import express = require('express')

import render from './handlers/render'
import hotMiddleware from './middlewares/hot-reload'

const DIST_PUBLIC = '.dist/public'
const DIST_STATIC = '.dist/static'

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use('/', express.static('public'))

  hotMiddleware.set(app)
} else {
  app.use('/', express.static(DIST_PUBLIC))
}

app.use('/static', express.static(DIST_STATIC))

app.get('/*', render)

export default app
