import express from 'express'

import render from './handlers/render'

const app = express()

app.use(express.static('../public'))

app.get('/*', render)

app.listen(3000, () => {
  console.log('Server is listening on http://localhost:3000')
})
