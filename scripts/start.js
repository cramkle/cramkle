process.env.NODE_ENV = 'development'
process.env.BABEL_ENV = 'development'

process.on('unhandledRejection', err => {
  throw err
})

require('../config/env')

const chalk = require('chalk')
const webpack = require('webpack')
const clearConsole = require('react-dev-utils/clearConsole')

const paths = require('../config/paths')
const serverConfig = require('../config/webpack.config.server')
const clientConfig = require('../config/webpack.config.dev')

const isInteractive = process.stdout.isTTY

const { checkBrowsers } = require('react-dev-utils/browsersHelper')
checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    const compiler = webpack([serverConfig, clientConfig])

    const { invalid, done } = compiler.hooks

    invalid.tap('invalid', () => {
      if (isInteractive) {
        clearConsole()
      }

      console.log(chalk.cyan('Compiling...'))
    })

    done.tap('done', stats => {
      if (isInteractive) {
        clearConsole()
      }

      const messages = stats.toJson({ all: false, errors: true, warnings: true })

      const isSuccessful = !messages.errors.length && !messages.warnings.length

      if (isSuccessful) {
        console.log(chalk.green('Compiled successfully!'))
      }

      if (messages.errors.length) {
        console.log(chalk.red('Failed to compile\n'))
        console.log(messages.errors.join('\n\n'))
        return
      }

      if (messages.warnings.length) {
        console.log(chalk.yellow('Compiled with warnings\n'))
        console.log(messages.warnings.join('\n\n'))
      }
    })

    console.log(chalk.cyan('Starting compilation...\n'))

    compiler.watch({}, () => {
      // do nothing
    })
  })
