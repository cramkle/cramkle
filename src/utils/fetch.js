if (!process.browser) {
  module.exports = require('node-fetch/lib/index.js')
} else {
  module.exports = window.fetch
}
