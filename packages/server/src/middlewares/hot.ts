import { Application } from 'express'
import webpack from 'webpack'

import createWebpackConfig from '../../config/createWebpackConfig'

const clientConfig = createWebpackConfig({
  dev: true,
  isServer: false,
})

const serverConfig = createWebpackConfig({
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
