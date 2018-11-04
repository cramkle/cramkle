const webpack = require('webpack')
const path = require('path')
const PnpWebpackPlugin = require('pnp-webpack-plugin')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const paths = require('./paths')
const getClientEnvironment = require ('./env')

// Get environment variables to inject into our app.
// Also pass in `true`, as we're in the server config.
const env = getClientEnvironment(true)

// style files regexes
const cssRegex = /\.css$/
const sassRegex = /\.(scss|sass)$/

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  target: 'node',
  entry: [
    paths.serverIndexJs,
  ],
  output: {
    filename: 'server.js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebook/create-react-app/issues/253
    modules: ['node_modules'].concat(
      process.env.NODE_PATH &&
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ).filter(Boolean),
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebook/create-react-app/issues/290
    // `web` extension prefixes have been added for better support
    // for React Native Web.
    extensions: paths.moduleFileExtensions.map(ext => `.${ext}`),
    plugins: [
      // Adds support for installing with Plug'n'Play, leading to faster installs and adding
      // guards against forgotten dependencies and such.
      PnpWebpackPlugin,
      // Prevents users from importing files from outside of src/ (or node_modules/).
      // This often causes confusion because we only process files within src/ with babel.
      // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
      // please link the files into your node_modules/ and let module-resolution kick in.
      // Make sure your source files are compiled, as they will not be processed in any way.
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ],
  },
  resolveLoader: {
    plugins: [
      // Also related to Plug'n'Play, but this time it tells Webpack to load its loaders
      // from the current package.
      PnpWebpackPlugin.moduleLoader(module),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },
      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      {
        test: /\.(js|mjs|jsx)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: require.resolve('react-dev-utils/eslintFormatter'),
              eslintPath: require.resolve('eslint'),
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: paths.appSrc,
      },
      {
        oneOf: [
          // Process application JS with Babel.
          // The preset includes JSX, Flow, and some ESnext features.
          {
            test: /\.(js|mjs|jsx)$/,
            include: [paths.appSrc, paths.serverSrc],
            loader: require.resolve('babel-loader'),
            options: {
              extends: path.resolve('.babelrc.json'),
              customize: require.resolve(
                'babel-preset-react-app/webpack-overrides'
              ),

              plugins: [
                [
                  require.resolve('babel-plugin-named-asset-import'),
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
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
          // Process any JS outside of the app with Babel.
          // Unlike the application JS, we only compile the standard ES features.
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
          {
            test: [cssRegex, sassRegex],
            use: [
              {
                // Since we are on the server configuration, we skip all css
                // imports so it won't break the build.
                loader: 'css-loader/locals',
              },
            ],
          },
          {
            test: /\.(graphql|gql)$/,
            exclude: /node_modules/,
            loader: 'graphql-tag/loader',
          },
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            exclude: [/\.(js|mjs|jsx)$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'public/media/[name].[hash:8].[ext]',
              publicPath: url => url.replace(/public/, ''),
              // Do not actually create these files
              emit: false,
            },
          },
        ],
      },
      // ** STOP ** Are you adding a new loader?
      // Make sure to add the new loader(s) before the "file" loader.
    ],
  },
  plugins: [
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
    new webpack.DefinePlugin(env.stringified),
  ],
}
