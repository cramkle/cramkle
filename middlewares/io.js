const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

module.exports = {
  set: app => {
    app.use(cors())
    app.use(cookieParser())
    app.use(bodyParser.json())
  },
}
