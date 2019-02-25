import { Application } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'

export default {
  set: (app: Application) => {
    app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
    app.use(cookieParser())
    app.use(bodyParser.json())
  },
}
