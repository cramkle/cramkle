process.env.NODE_ENV = 'development'
process.env.BABEL_ENV = 'development'

process.on('unhandledRejection', err => {
  throw err
})

require('../config/env')

const webpack = require('webpack')
const express = require('express')

const { info, warn, err } = require('./utils/info')
const paths = require('../config/paths')
const serverConfig = require('../config/webpack.config.server')
const clientConfig = require('../config/webpack.config.dev')

const server = require('../server/index')

const app = express()

app.use(server)

const isInteractive = process.stdout.isTTY

const { checkBrowsers } = require('react-dev-utils/browsersHelper')
checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    let runningServer = null

    const compiler = webpack([serverConfig, clientConfig])

    const { invalid, done } = compiler.hooks

    invalid.tap('invalid', () => {
      info('webpack', 'Compiling...')
    })

    done.tap('done', stats => {
      const messages = stats.toJson({ all: false, errors: true, warnings: true })

      const isSuccessful = !messages.errors.length && !messages.warnings.length

      if (isSuccessful) {
        info('webpack', 'Compiled successfully!')
      }

      if (messages.errors.length) {
        err('webpack', 'Failed to compile')
        console.error(messages.errors.join('\n\n'))
        return
      }

      if (messages.warnings.length) {
        warn('webpack', 'Compiled with warnings')
        console.log(messages.warnings.join('\n\n'))
      }
    })

    info('webpack', 'Starting webpack compiler')

    compiler.watch({}, () => {
      if (runningServer === null) {
        info('server', 'Starting development server')

        runningServer = app.listen(3000, () => {
          info('server', 'Listening on port 3000')
        })
      }
    })
  })
