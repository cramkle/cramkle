// @ts-check
const { createRequestHandler } = require('@casterly/express')
const cookieParser = require('cookie-parser')
const express = require('express')
const requestLanguage = require('express-request-language')
const helmet = require('helmet')
const { createProxyMiddleware } = require('http-proxy-middleware')
const { v4: uuidv4 } = require('uuid')

const app = express()

if (process.env.NODE_ENV === 'production') {
  app.use(helmet())

  app.use((_, res, next) => {
    res.locals.cspNonce = Buffer.from(uuidv4()).toString('base64')
    next()
  })

  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", '*.sentry.io'],
        baseUri: ["'self'"],
        blockAllMixedContent: [],
        fontSrc: ["'self'", 'https:', 'data:'],
        frameAncestors: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        scriptSrc: [
          "'self'",
          (
            /** @type {any} */
            _,
            /** @type {any} */
            res
          ) => `'nonce-${res.locals.cspNonce}'`,
        ],
        scriptSrcAttr: ["'none'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        upgradeInsecureRequests: [],
      },
    })
  )
}

app.use(cookieParser())

app.use(
  '/_c',
  createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true,
    cookieDomainRewrite: {
      'localhost:5000': 'localhost:3000',
    },
    logLevel: 'silent',
  })
)

app.use(
  requestLanguage({
    languages: ['en', 'pt'],
    cookie: {
      name: 'language',
    },
  })
)

app.use((req, _, next) => {
  req.headers['x-cramkle-lang'] = req.language
  next()
})

app.use(createRequestHandler())

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`)
})
