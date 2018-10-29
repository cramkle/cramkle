const express = require('express')
const app = express()

const graphqlMiddleware = require('./middlewares/graphql')
const ioMiddleware = require('./middlewares/io')

ioMiddleware.set(app)
graphqlMiddleware.set(app)

const port = process.env.PORT || 5000

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`App listening on https://localhost:${port}`)
})
