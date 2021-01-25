const path = require('path')

module.exports = {
  plugins: {
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
    },
    tailwindcss: {},
    [path.resolve(__dirname, 'postcss', 'theme-prefix.js')]: {},
  },
}
