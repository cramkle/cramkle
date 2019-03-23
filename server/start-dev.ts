import express = require('express')

import server from './index'
import devMiddleware from './middlewares/dev'

const app = express()

devMiddleware.set(app)

app.use(server)

app.listen(3000, () => {
  console.log('Server listening on port 3000')
})
