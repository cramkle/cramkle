const bodyParser = require('body-parser')
const cors = require('cors')

module.exports = {
  set: app => {
    app.use(cors())
    app.use(bodyParser.json())
  },
}
