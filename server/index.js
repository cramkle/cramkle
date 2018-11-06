import express from 'express'

import assets from './middlewares/assets'
import render from './handlers/render'

const app = express()

let buildFolder

if (process.env.NODE_ENV === 'development') {
  buildFolder = '.dev-build'
} else {
  buildFolder = 'build'
}

app.use(express.static('public'))
app.use(assets(buildFolder))

app.get('/*', render)

app.listen(3000, () => {
  console.log('Server is listening on http://localhost:3000')
})
