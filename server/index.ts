import express = require('express')
import helmet = require('helmet')

import render from './handlers/render'

const DIST_PUBLIC = '.dist/public'
const DIST_STATIC = '.dist/static'

const app = express()

app.use(helmet())

app.use('/', express.static(DIST_PUBLIC))

app.use('/static', express.static(DIST_STATIC))

app.get('/*', render)

export default app
