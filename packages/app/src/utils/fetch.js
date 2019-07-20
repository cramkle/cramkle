if (typeof window !== 'undefined') {
  module.exports = window.fetch
} else {
  module.exports = require('node-fetch')
}
