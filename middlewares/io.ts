import { Application } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

export default {
  set: (app: Application) => {
    app.use(cookieParser())
    app.use(bodyParser.json())
  },
}
