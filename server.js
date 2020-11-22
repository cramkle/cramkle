// @ts-check
const { createRequestHandler } = require('@casterly/express')
const cookieParser = require('cookie-parser')
const express = require('express')
const requestLanguage = require('express-request-language')
const helmet = require('helmet')

const app = express()

if (process.env.NODE_ENV === 'production') {
  app.use(helmet())
}

app.use(cookieParser())

if (process.env.NODE_ENV !== 'production') {
  const { createProxyMiddleware } = require('http-proxy-middleware')

  app.use(
    '/_c',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      pathRewrite: {
        '^/_c': '',
      },
      cookieDomainRewrite: {
        'localhost:5000': 'localhost:3000',
      },
      logLevel: 'silent',
    })
  )
}

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
