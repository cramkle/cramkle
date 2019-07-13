import path from 'path'
import webpack, { Configuration } from 'webpack'
// @ts-ignore
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin'
import ModuleScopePlugin from 'react-dev-utils/ModuleScopePlugin'
import ManifestPlugin from 'webpack-manifest-plugin'
// @ts-ignore
import ModuleNotFoundPlugin from 'react-dev-utils/ModuleNotFoundPlugin'
import nodeExternals from 'webpack-node-externals'

import ChunkNamesPlugin from './webpack/plugins/ChunkNamesPlugin'
import { Options } from './webpack/types'
import { getStyleLoaders } from './webpack/styles'
import { createWorkboxPlugin } from './webpack/workbox'
import { createOptimizationConfig } from './webpack/optimization'
import getClientEnvironment from './env'
import * as paths from './paths'
import {
  STATIC_RUNTIME_MAIN,
  STATIC_RUNTIME_WEBPACK,
  STATIC_RUNTIME_HOT,
  STATIC_CHUNKS_PATH,
  STATIC_MEDIA_PATH,
  ASSET_MANIFEST_FILE,
} from './constants'

// style files regexes
const cssRegex = /\.global\.css$/
const cssModuleRegex = /\.css$/
const sassRegex = /\.global\.(scss|sass)$/
const sassModuleRegex = /\.(scss|sass)$/

const getBaseWebpackConfig = (options?: Options): Configuration => {
  const { isServer = false, dev = false } = options || {}

  // Get environment variables to inject into our app.
  const env = getClientEnvironment(isServer)

  const sassLoaderConfig = {
    loader: 'sass-loader',
    options: {
      includePaths: [
        path.resolve('node_modules'),
        path.resolve('../../node_modules'),
      ],
    },
  }

  const cssConfig = getStyleLoaders({ dev, isServer })
  const cssModuleConfig = getStyleLoaders({ dev, isServer, cssModules: true })
  const sassConfig = getStyleLoaders({
    dev,
    isServer,
    loaders: [sassLoaderConfig],
  })
  const sassModuleConfig = getStyleLoaders({
    dev,
    isServer,
    cssModules: true,
    loaders: [sassLoaderConfig],
  })

  const cssRules = [
    {
      test: cssRegex,
      use: cssConfig,
    },
    {
      test: cssModuleRegex,
      exclude: [cssRegex, /node_modules/],
      use: cssModuleConfig,
    },
    {
      test: sassRegex,
      use: sassConfig,
    },
    {
      test: sassModuleRegex,
      exclude: [sassRegex, /node_modules/],
      use: sassModuleConfig,
    },
  ]

  const dir = paths.appDist
  const outputDir = isServer ? 'server' : ''
  const outputPath = path.join(dir, outputDir)
  const webpackMode = dev ? 'development' : 'production'

  const chunkFilename = dev ? '[name]' : '[name].[contenthash]'
  const extractedCssFilename = dev ? '[name]' : '[name].[contenthash:8]'

  return {
    mode: webpackMode,
    name: isServer ? 'server' : 'client',
    target: isServer ? 'node' : 'web',
    devtool: dev && !isServer ? 'cheap-module-source-map' : false,
    externals: isServer ? [nodeExternals()] : [],
    entry: {
      ...(dev && !isServer
        ? { [STATIC_RUNTIME_HOT]: 'webpack-hot-middleware/client' }
        : {}),
      [STATIC_RUNTIME_MAIN]: paths.appIndexJs,
    },
    output: {
      publicPath: '/',
      path: outputPath,
      // @ts-ignore
      filename: ({ chunk }: { chunk: { name: string } }) => {
        // Use `[name]-[contenthash].js` in production
        if (
          !dev &&
          (chunk.name === STATIC_RUNTIME_MAIN ||
            chunk.name === STATIC_RUNTIME_WEBPACK)
        ) {
          return `${chunk.name}-[contenthash].js`
        }
        return '[name].js'
      },
      chunkFilename: isServer
        ? `${chunkFilename}.js`
        : `${STATIC_CHUNKS_PATH}/${chunkFilename}.js`,
      hotUpdateMainFilename: 'static/webpack/[hash].hot-update.json',
      hotUpdateChunkFilename: 'static/webpack/[id].[hash].hot-update.js',
      devtoolModuleFilenameTemplate: info =>
        path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
      libraryTarget: isServer ? 'commonjs2' : 'jsonp',
    },
    performance: { hints: false },
    optimization: createOptimizationConfig({ dev, isServer }),
    resolve: {
      modules: ['node_modules'].concat(
        process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
      ),
      extensions: paths.moduleFileExtensions.map(ext => `.${ext}`),
      plugins: [new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])],
      alias: {
        'react-dom': dev ? '@hot-loader/react-dom' : 'react-dom',
      },
    },
    module: {
      strictExportPresence: true,
      rules: [
        // Disable require.ensure as it's not a standard language feature.
        { parser: { requireEnsure: false } },
        {
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                name: `${STATIC_MEDIA_PATH}/[name].[hash:8].[ext]`,
              },
            },
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: paths.appSrc,
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                presets: [
                  require.resolve('@babel/preset-env'),
                  require.resolve('@babel/preset-react'),
                  require.resolve('@babel/preset-typescript'),
                ],
                plugins: [
                  dev && require.resolve('react-hot-loader/babel'),
                  [
                    require.resolve('babel-plugin-named-asset-import'),
                    {
                      loaderMap: {
                        svg: {
                          ReactComponent:
                            '@svgr/webpack?-prettier,-svgo![path]',
                        },
                      },
                    },
                  ],
                  require.resolve('@babel/plugin-transform-runtime'),
                  require.resolve('@babel/plugin-proposal-class-properties'),
                  require.resolve('@babel/plugin-syntax-dynamic-import'),
                  require.resolve('babel-plugin-macros'),
                ].filter(Boolean),
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: true,
                // Don't waste time on Gzipping the cache
                cacheCompression: false,
              },
            },
            {
              test: /\.(js|mjs)$/,
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                compact: false,
                cacheDirectory: true,
                // Don't waste time on Gzipping the cache
                cacheCompression: false,

                presets: [
                  [
                    require.resolve('@babel/preset-env'),
                    {
                      useBuiltIns: 'entry',
                      corejs: 3,
                      modules: false,
                      exclude: ['transform-typeof-symbol'],
                    },
                  ],
                ],
                plugins: [
                  [
                    require.resolve('@babel/plugin-transform-destructuring'),
                    {
                      loose: false,
                      selectiveLoose: [
                        'useState',
                        'useEffect',
                        'useContext',
                        'useReducer',
                        'useCallback',
                        'useMemo',
                        'useRef',
                        'useImperativeHandle',
                        'useLayoutEffect',
                        'useDebugValue',
                      ],
                    },
                  ],
                  require.resolve('@babel/plugin-transform-runtime'),
                  require.resolve('@babel/plugin-syntax-dynamic-import'),
                ],

                // If an error happens in a package, it's possible to be
                // because it was compiled. Thus, we don't want the browser
                // debugger to show the original code. Instead, the code
                // being evaluated would be much more helpful.
                sourceMaps: false,
              },
            },
            ...cssRules,
            {
              test: /\.(graphql|gql)$/,
              exclude: /node_modules/,
              loader: 'graphql-tag/loader',
            },
            // "file" loader makes sure those assets get served by WebpackDevServer.
            // When you `import` an asset, you get its (virtual) filename.
            // In production, they would get copied to the `build` folder.
            // This loader doesn't use a "test" so it will catch all modules
            // that fall through the other loaders.
            {
              // Exclude `js` files to keep "css" loader working as it injects
              // its runtime that would otherwise be processed through "file" loader.
              // Also exclude `html` and `json` extensions so they get processed
              // by webpacks internal loaders.
              exclude: [/\.(js|mjs|jsx)$/, /\.html$/, /\.json$/],
              loader: require.resolve('file-loader'),
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
          ],
        },
        // ** STOP ** Are you adding a new loader?
        // Make sure to add the new loader(s) before the "file" loader.
      ],
    },
    plugins: [
      new ExtractCssChunks({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: `${STATIC_CHUNKS_PATH}/${extractedCssFilename}.css`,
        chunkFilename: `${STATIC_CHUNKS_PATH}/${extractedCssFilename}.chunk.css`,
        reloadAll: true,
      }),
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
      new ChunkNamesPlugin(),
      new webpack.DefinePlugin(env.stringified),
      dev && !isServer && new webpack.HotModuleReplacementPlugin(),
      new ManifestPlugin({
        fileName: ASSET_MANIFEST_FILE,
      }),
      createWorkboxPlugin({ dev, isServer }),
      // This gives some necessary context to module not found errors, such as
      // the requesting resource.
      dev && new ModuleNotFoundPlugin(paths.appPath),
      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      // See https://github.com/facebook/create-react-app/issues/240
      dev && new CaseSensitivePathsPlugin(),
      // If you require a missing module and then `npm install` it, you still have
      // to restart the development server for Webpack to discover it. This plugin
      // makes the discovery automatic so you don't have to restart.
      // See https://github.com/facebook/create-react-app/issues/186
      dev && new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    ].filter(Boolean),
    node: !isServer && {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      // eslint-disable-next-line
      child_process: 'empty',
    },
  }
}

export default getBaseWebpackConfig
