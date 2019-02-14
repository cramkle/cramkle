const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

module.exports = {
  set: app => {
    app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
    app.use(cookieParser())
    app.use(bodyParser.json())
  },
}
