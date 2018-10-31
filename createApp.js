const express = require('express')
const mongoose = require('mongoose')

const graphqlMiddleware = require('./middlewares/graphql')
const ioMiddleware = require('./middlewares/io')

module.exports = async () => {
  const app = express()

  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost/cramkle'

  try {
    await mongoose.connect(mongoUri, { useNewUrlParser: true })
  } catch (e) {
    /* eslint-disable no-console */
    console.error('Failed to obtain a connection to MongoDB')
    console.error(e)
    process.exit(1)
    /* eslint-enable no-console */
  }

  ioMiddleware.set(app)
  graphqlMiddleware.set(app)

  return app
}
