import express, { Application } from 'express'
import proxy from 'http-proxy-middleware'

export default {
  set: (app: Application) => {
    app.use(
      '/_c',
      proxy({
        target: 'http://localhost:5000',
        pathRewrite: {
          '^/_c': '',
        },
      })
    )

    app.use('/', express.static('public'))
  },
}
