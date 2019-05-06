import express from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
// @ts-ignore no types package
import requestLanguage from 'express-request-language'

import render from './render'

const DIST_PUBLIC = '.dist/public'
const DIST_STATIC = '.dist/static'

const app = express()

app.use(helmet())
app.use(cookieParser())
app.use(
  requestLanguage({
    languages: ['en', 'pt'],
    cookie: {
      name: 'language',
    },
  })
)

app.use('/', express.static(DIST_PUBLIC))

app.use('/static', express.static(DIST_STATIC))

app.get('/*', render)

export default app
