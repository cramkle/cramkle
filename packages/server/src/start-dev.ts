import express from 'express'

import server from './index'
import proxyMiddleware from './middlewares/proxy'
import webpackMiddleware from './middlewares/webpack'

import { logStore } from './output/logger'

const PORT = 3000

const start = () => {
  const app = express()

  proxyMiddleware.set(app)
  webpackMiddleware.set(app)

  app.use(server)

  logStore.setState({ port: PORT })

  app.listen(PORT)
}

export default start
