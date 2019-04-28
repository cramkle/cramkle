import express from 'express'

import server from '../dist/index'
import devMiddleware from '../dist/middlewares/dev'
import hotMiddleware from '../dist/middlewares/hot'

const app = express()

devMiddleware.set(app)
hotMiddleware.set(app)

app.use(server)

app.listen(3000, () => {
  console.log('Server listening on port 3000')
})
