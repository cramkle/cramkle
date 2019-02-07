const path = require('path')
const webpack = require('webpack')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin')
const nodeExternals = require('webpack-node-externals')
const TerserPlugin = require('terser-webpack-plugin')
const ChunkNamesPlugin = require('./webpack/plugins/ChunkNamesPlugin')
const getClientEnvironment = require('./env')
const paths = require('./paths')
const {
  STATIC_RUNTIME_MAIN,
  STATIC_RUNTIME_WEBPACK,
  STATIC_CHUNKS_PATH,
  STATIC_MEDIA_PATH,
} = require('./constants')

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = '/'

// style files regexes
const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/

// common function to get style loaders
const getStyleLoaders = ({ isServer, dev, cssModules, loaders = [] }) => {
  const postcssLoader = {
    // Options for PostCSS as we reference these options twice
    // Adds vendor prefixing based on your specified browser support in
    // package.json
    loader: require.resolve('postcss-loader'),
    options: {
      // Necessary for external CSS imports to work
      // https://github.com/facebook/create-react-app/issues/2677
      ident: 'postcss',
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009',
          },
          stage: 3,
        }),
      ],
    },
  }

  const cssLoader = {
    loader: require.resolve(isServer ? 'css-loader/locals' : 'css-loader'),
    options: {
      importLoaders: 1 + loaders.length,
      modules: cssModules,
    },
  }

  if (isServer && !cssModules) {
    return ['ignore-loader']
  }

  return [
    !isServer && dev && 'extracted-loader',
    !isServer && ExtractCssChunks.loader,
    cssLoader,
    postcssLoader,
    ...loaders,
  ].filter(Boolean)
}

const optimizationConfig = ({ dev, isServer }) => {
  const terserPluginConfig = {
    parallel: true,
    sourceMap: false,
    cache: true,
    cacheKeys: keys => {
      delete keys.path
      return keys
    },
  }

  if (isServer) {
    return {
      splitChunks: false,
      minimize: false,
    }
  }

  const config = {
    runtimeChunk: {
      name: STATIC_RUNTIME_WEBPACK,
    },
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
        styles: {
          name: 'styles',
          test: /.(sa|sc|c)ss$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  }

  if (dev) {
    return config
  }

  config.minimizer = [new TerserPlugin(terserPluginConfig)]

  config.splitChunks.chunks = 'all'
  config.splitChunks.cacheGroups.react = {
    name: 'commons',
    chunks: 'all',
    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
  }

  return config
}

const getBaseWebpackConfig = ({ dev = false, isServer = false }) => {
  // Get environment variables to inject into our app.
  const env = getClientEnvironment(isServer)

  const sassLoaderConfig = {
    loader: 'sass-loader',
    options: {
      includePaths: [path.resolve('node_modules')],
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
      exclude: cssModuleRegex,
      use: cssConfig,
    },
    {
      test: cssModuleRegex,
      use: cssModuleConfig,
    },
    {
      test: sassRegex,
      exclude: sassModuleRegex,
      use: sassConfig,
    },
    {
      test: sassModuleRegex,
      use: sassModuleConfig,
    },
  ]

  const dir = dev ? paths.appDist : paths.appBuild
  const outputDir = isServer ? 'server' : ''
  const outputPath = path.join(dir, outputDir)
  const webpackMode = dev ? 'development' : 'production'

  const chunkFilename = dev ? '[name]' : '[name].[contenthash]'
  const extractedCssFilename = dev ? '[name]' : '[name].[contenthash:8]'

  return {
    mode: webpackMode,
    name: isServer ? 'server' : 'client',
    target: isServer ? 'node' : 'web',
    devtool: dev ? 'cheap-module-source-map' : false,
    externals: isServer ? [nodeExternals()] : [],
    entry: {
      [STATIC_RUNTIME_MAIN]: [paths.appIndexJs],
    },
    output: {
      publicPath: '/',
      path: outputPath,
      filename: '[name].js',
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
    optimization: optimizationConfig({ dev, isServer }),
    resolve: {
      modules: ['node_modules'].concat(
        process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
      ),
      extensions: paths.moduleFileExtensions.map(ext => `.${ext}`),
      plugins: [new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])],
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
              test: /\.(js|mjs|jsx)$/,
              include: paths.appSrc,
              loader: require.resolve('babel-loader'),
              options: {
                extends: path.resolve('.babelrc'),
                customize: require.resolve(
                  'babel-preset-react-app/webpack-overrides'
                ),

                plugins: [
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
                ],
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
                presets: [
                  [
                    require.resolve('babel-preset-react-app/dependencies'),
                    { helpers: true },
                  ],
                ],
                cacheDirectory: true,
                // Don't waste time on Gzipping the cache
                cacheCompression: false,

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
        orderWarning: false,
        reloadAll: true,
      }),
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
      new ChunkNamesPlugin(),
      new webpack.DefinePlugin(env.stringified),
      dev && !isServer && new webpack.HotModuleReplacementPlugin(),
      new ManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: publicPath,
      }),
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
      !dev &&
        !isServer &&
        new WorkboxWebpackPlugin.GenerateSW({
          clientsClaim: true,
          exclude: [/\.map$/, /asset-manifest\.json$/],
          importWorkboxFrom: 'cdn',
          navigateFallback: '/index.html',
          navigateFallbackBlacklist: [
            // Exclude URLs starting with /_, as they're likely an API call
            new RegExp('^/_'),
            // Exclude URLs containing a dot, as they're likely a resource in
            // public/ and not a SPA route
            new RegExp('/[^/]+\\.[^/]+$'),
          ],
        }),
    ].filter(Boolean),
    node: !isServer && {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
  }
}

module.exports = getBaseWebpackConfig
