import { Loader } from 'webpack'
// @ts-ignore
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin'

import { Options } from './types'

interface StyleOptions extends Options {
  cssModules?: boolean
  loaders?: Loader[]
}

// common function to get style loaders
export const getStyleLoaders = ({
  isServer,
  dev,
  cssModules = false,
  loaders = [],
}: StyleOptions) => {
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
    loader: require.resolve('css-loader'),
    options: {
      importLoaders: 1 + loaders.length,
      modules: cssModules,
      exportOnlyLocals: isServer,
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
