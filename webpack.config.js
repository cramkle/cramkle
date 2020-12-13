const path = require('path')

const webpack = require('webpack')
const { InjectManifest } = require('workbox-webpack-plugin')

const JS_CSS_REGEX = /\.(?:js|css)$/
const SOURCE_MAP_REGEX = /\.(?:map)$/
const IMAGE_REGEX = /\.(?:png|gif|jpg|jpeg|webp|svg)$/

const createWorkboxPlugin = (dev) => {
  return new InjectManifest({
    swSrc: path.join(__dirname, 'src/serviceWorker.ts'),
    swDest: 'public/service-worker.js',
    exclude: dev
      ? [JS_CSS_REGEX, IMAGE_REGEX, SOURCE_MAP_REGEX, new RegExp('hot-update')]
      : [],
    webpackCompilationPlugins: [
      new webpack.DefinePlugin(
        JSON.stringify({
          'typeof window': JSON.stringify('undefined'),
        })
      ),
    ],
    modifyURLPrefix: {
      '/static/': '/_casterly/static/',
    },
  })
}

module.exports = (config, { dev, isServer }) => {
  if (!isServer) {
    config.plugins.push(createWorkboxPlugin(dev))
  }

  config.module.rules[0].oneOf[2].options.presets[2][1].runtime = 'automatic'
  config.module.rules[0].oneOf[2].options.plugins.push(
    require.resolve('babel-plugin-graphql-tag')
  )

  if (!isServer) {
    config.module.rules[0].oneOf[4].use[2].options.postcssOptions.plugins.push(
      require.resolve('tailwindcss')
    )
  }

  return config
}