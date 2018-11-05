import express from 'express'

import render from './handlers/render'

const app = express()

app.use(express.static('public'))

if (process.env.NODE_ENV === 'development') {
  app.use(express.static('.dev-build'))
} else {
  app.use(express.static('build'))
}

app.get('/*', render)

app.listen(3000, () => {
  console.log('Server is listening on http://localhost:3000')
})
