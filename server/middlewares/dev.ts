import express = require('express')
import proxy = require('http-proxy-middleware')
import { Application } from 'express'

import hotMiddleware from './hot'

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

    hotMiddleware.set(app)
  },
}
