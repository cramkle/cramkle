const { canUseDOM } = require('exenv')

if (!canUseDOM) {
  module.exports = require('node-fetch/lib/index.js')
} else {
  module.exports = window.fetch
}
