import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { Application } from 'express'

export default {
  set: (app: Application) => {
    app.use(cookieParser())
    app.use(bodyParser.json())
  },
}
