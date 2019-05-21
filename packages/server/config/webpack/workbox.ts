import { GenerateSW, GenerateSWOptions } from 'workbox-webpack-plugin'

import { Options } from './types'

const JS_CSS_REGEX = /\.(?:js|css)$/
const MAP_REGEX = /\.(?:map)$/
const IMAGE_REGEX = /\.(?:png|gif|jpg|jpeg|webp|svg)$/

export const createWorkboxPlugin = ({ dev }: Options) => {
  const runtimeCaching: GenerateSWOptions['runtimeCaching'] = [
    {
      // api
      urlPattern: /_c/,
      handler: 'NetworkFirst',
    },
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        cacheableResponse: {
          statuses: [0, 200],
        },
        expiration: {
          maxEntries: 20,
          // cache for a year
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
      },
    },
    {
      // image assets
      urlPattern: IMAGE_REGEX,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 60,
          // cache for 30 days
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    {
      urlPattern: JS_CSS_REGEX,
      handler: dev ? 'NetworkOnly' : 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
      },
    },
  ]

  if (dev) {
    runtimeCaching.concat([
      {
        urlPattern: /(__webpack_hmr|hot-update)/,
        handler: 'NetworkOnly',
      },
    ])
  } else {
    runtimeCaching.concat([
      {
        urlPattern: /https:\/\/(www\.)?cramkle\.com/,
        handler: 'NetworkFirst',
      },
    ])
  }

  return new GenerateSW({
    swDest: 'public/service-worker.js',
    importsDirectory: 'static',
    runtimeCaching,
    exclude: dev
      ? [JS_CSS_REGEX, IMAGE_REGEX, MAP_REGEX, new RegExp('hot-update')]
      : [],
  })
}
