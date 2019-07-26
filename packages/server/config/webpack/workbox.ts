import webpack from 'webpack'
import { InjectManifest } from 'workbox-webpack-plugin'

import { Options } from './types'
import getClientEnvironment from '../env'
import * as paths from '../paths'

const JS_CSS_REGEX = /\.(?:js|css)$/
const SOURCE_MAP_REGEX = /\.(?:map)$/
const IMAGE_REGEX = /\.(?:png|gif|jpg|jpeg|webp|svg)$/

export const createWorkboxPlugin = ({ dev }: Options) => {
  const workerEnv = getClientEnvironment({ worker: true })

  return new InjectManifest({
    swSrc: paths.appServiceWorker,
    swDest: 'public/service-worker.js',
    exclude: dev
      ? [JS_CSS_REGEX, IMAGE_REGEX, SOURCE_MAP_REGEX, new RegExp('hot-update')]
      : [],
    // @ts-ignore
    webpackCompilationPlugins: [
      new webpack.DefinePlugin(workerEnv.stringified),
    ],
  })
}
