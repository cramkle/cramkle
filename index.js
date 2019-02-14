const express = require('express')
const mongoose = require('mongoose')

const graphqlMiddleware = require('./middlewares/graphql')
const ioMiddleware = require('./middlewares/io')
const authMiddleware = require('./middlewares/auth')

const authRouter = require('./routes/auth')

const app = express()

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cramkle'

ioMiddleware.set(app)
graphqlMiddleware.set(app)
authMiddleware.set(app)

app.use('/auth', authRouter)

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useCreateIndex: true })
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
