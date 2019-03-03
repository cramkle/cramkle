import { Application } from 'express'
import webpack = require('webpack')
import createWebpackConfig = require('../../config/createWebpackConfig')

// @ts-ignore
const clientConfig: webpack.Configuration = createWebpackConfig({
  dev: true,
  isServer: false,
})
const compiler = webpack(clientConfig)

export default {
  set: (app: Application) => {
    app.use(
      require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: clientConfig.output.publicPath,
        writeToDisk: true,
      })
    )

    app.use(require('webpack-hot-middleware')(compiler))
  },
}
