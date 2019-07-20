import express from 'express'

import server from './index'
import * as Log from './output/log'

const start = () => {
  const app = express()

  app.use(server)

  app.listen(3000, () => {
    Log.info('Server listening on port 3000')
  })
}

export default start
