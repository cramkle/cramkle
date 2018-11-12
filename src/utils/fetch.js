if (process.env.SSR) {
  module.exports = require('node-fetch/lib/index.js')
} else {
  module.exports = window.fetch
}
