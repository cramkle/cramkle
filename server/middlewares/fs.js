const fs = require('fs')
const { promisify } = require('util')

const patchedFs = Object.assign({}, fs, {
  readFile: promisify(fs.readFile),
})

const middleware = (fs = patchedFs) => (req, res, next) => {
  req.fs = fs

  next()
}

module.exports = middleware
