const express = require('express')
const mongoose = require('mongoose')
const app = express()

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/cramkle'

const graphqlMiddleware = require('./middlewares/graphql')
const ioMiddleware = require('./middlewares/io')

ioMiddleware.set(app)
graphqlMiddleware.set(app)

mongoose.connect(MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening on https://localhost:${PORT}`)
    })
  })
  .catch(e => {
    console.error('Failed to obtain a connection to MongoDB')
    console.error(e)
    process.exit(1)
  })
