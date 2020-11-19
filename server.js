// @ts-check
const { createRequestHandler } = require('@app-server/express')
const cookieParser = require('cookie-parser')
const express = require('express')
const requestLanguage = require('express-request-language')

const app = express()

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
