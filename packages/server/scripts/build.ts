/* eslint-disable no-console */

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

// Ensure environment variables are read.
import '../config/env'

import chalk from 'chalk'
import fs from 'fs-extra'
import webpack from 'webpack'
// @ts-ignore
import bfj from 'bfj'

import getBaseWebpackConfig from '../config/createWebpackConfig'
import * as paths from '../config/paths'
import checkRequiredFiles from 'react-dev-utils/checkRequiredFiles'
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'
import FileSizeReporter, {
  OpaqueFileSizes,
} from 'react-dev-utils/FileSizeReporter'
import printBuildError from 'react-dev-utils/printBuildError'

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
// @ts-ignore
import { checkBrowsers } from 'react-dev-utils/browsersHelper'

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild

// Create the production build and print the deployment instructions.
function build(previousFileSizes: OpaqueFileSizes, writeStatsJson = false) {
  console.log('Creating an optimized production build...')

  let compiler = webpack([
    getBaseWebpackConfig(),
    getBaseWebpackConfig({ isServer: true }),
  ])

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages
      if (err) {
        if (!err.message) {
          return reject(err)
        }
        messages = formatWebpackMessages({
          _showErrors: true,
          _showWarnings: true,
          errors: [err.message],
          warnings: [],
        })
      } else {
        messages = formatWebpackMessages(
          stats.toJson({ all: false, warnings: true, errors: true })
        )
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1
        }
        return reject(new Error(messages.errors.join('\n\n')))
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n'
          )
        )
        return reject(new Error(messages.warnings.join('\n\n')))
      }

      const resolveArgs = {
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      }

      if (writeStatsJson) {
        return bfj
          .write(paths.appDist + '/bundle-stats.json', stats.toJson())
          .then(() => resolve(resolveArgs))
          .catch((error: string) => reject(new Error(error)))
      }

      return resolve(resolveArgs)
    })
  })
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appDistPublic, {
    dereference: true,
  })
}

export default function startBuild() {
  // These sizes are pretty large. We'll warn for bundles exceeding them.
  const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024
  const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024

  const isInteractive = process.stdout.isTTY

  // Warn and crash if required files are missing
  if (!checkRequiredFiles([paths.appIndexJs])) {
    process.exit(1)
  }

  // Process CLI arguments
  const argv = process.argv.slice(3)
  const writeStatsJson = argv.indexOf('--stats') !== -1
  ;(checkBrowsers(paths.appPath, isInteractive) as Promise<void>)
    .then(() => {
      // First, read the current file sizes in build directory.
      // This lets us display how much they changed later.
      return measureFileSizesBeforeBuild(paths.appDist)
    })
    .then(previousFileSizes => {
      // Remove all content but keep the directory so that
      // if you're in it, you don't end up in Trash
      fs.emptyDirSync(paths.appDist)
      // Merge with the public folder
      copyPublicFolder()
      // Start the webpack build
      return build(previousFileSizes, writeStatsJson)
    })
    .then(
      ({ stats, previousFileSizes, warnings }) => {
        if (warnings.length) {
          console.log(chalk.yellow('Compiled with warnings.\n'))
          console.log(warnings.join('\n\n'))
          console.log(
            '\nSearch for the ' +
              chalk.underline(chalk.yellow('keywords')) +
              ' to learn more about each warning.'
          )
          console.log(
            'To ignore, add ' +
              chalk.cyan('// eslint-disable-next-line') +
              ' to the line before.\n'
          )
        } else {
          console.log(chalk.green('Compiled successfully.\n'))
        }

        const [clientStats] = stats.stats

        console.log('File sizes after gzip:\n')
        printFileSizesAfterBuild(
          clientStats,
          previousFileSizes,
          paths.appDist,
          WARN_AFTER_BUNDLE_GZIP_SIZE,
          WARN_AFTER_CHUNK_GZIP_SIZE
        )
      },
      (err: Error) => {
        console.log(chalk.red('Failed to compile.\n'))
        printBuildError(err)
        process.exit(1)
      }
    )
    .catch((err: Error) => {
      if (err && err.message) {
        console.log(err.message)
      }
      process.exit(1)
    })
}
