import { Application } from 'express'
import webpack = require('webpack')
import createWebpackConfig = require('../../config/createWebpackConfig')

// @ts-ignore
const clientConfig: webpack.Configuration = createWebpackConfig({
  dev: true,
  isServer: false,
})
// @ts-ignore
const serverConfig: webpack.Configuration = createWebpackConfig({
  dev: true,
  isServer: true,
})

const multiCompiler = webpack([clientConfig, serverConfig])

export default {
  set: (app: Application) => {
    app.use(
      require('webpack-dev-middleware')(multiCompiler, {
        noInfo: true,
        publicPath: clientConfig.output.publicPath,
        writeToDisk: true,
      })
    )

    app.use(require('webpack-hot-middleware')(multiCompiler.compilers[0]))
  },
}
