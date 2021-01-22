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

  config.module.rules.push({
    test: /\.(graphql|gql)$/,
    exclude: /node_modules/,
    loader: 'graphql-tag/loader',
  })

  return config
}
