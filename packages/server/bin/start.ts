import express from 'express'

import server from '../dist/index'

const app = express()

app.use(server)

app.listen(3000, () => {
  console.log('Server listening on port 3000')
})
