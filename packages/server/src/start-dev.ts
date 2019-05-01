import express from 'express'

import server from './index'
import devMiddleware from './middlewares/dev'
import hotMiddleware from './middlewares/hot'

const start = () => {
  const app = express()

  devMiddleware.set(app)
  hotMiddleware.set(app)

  app.use(server)

  app.listen(3000, () => {
    console.log('Server listening on port 3000')
  })
}

export default start
