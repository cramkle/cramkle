import express from 'express'

import server from './index'

const start = () => {
  const app = express()

  app.use(server)

  app.listen(3000, () => {
    console.log('Server listening on port 3000')
  })
}

export default start
