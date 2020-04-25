import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

import graphqlMiddleware from './middlewares/apollo'
import authMiddleware from './middlewares/auth'
import ioMiddleware from './middlewares/io'
import { getConnection } from './mongo/connection'
import authRouter from './routes/auth'

const app = express()

const PORT = process.env.PORT ?? 5000

app.use(helmet())
app.use(morgan('dev'))

ioMiddleware.set(app)
authMiddleware.set(app)
graphqlMiddleware.set(app)

app.use('/auth', authRouter)

getConnection()
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`App listening on https://localhost:${PORT}`)
    })
  })
  .catch(() => {
    process.exit(1)
  })
