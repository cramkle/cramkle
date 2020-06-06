/* env: webworker */

import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import {
  CacheFirst,
  NetworkFirst,
  NetworkOnly,
  StaleWhileRevalidate,
} from 'workbox-strategies'

const JS_CSS_REGEX = /\.(?:js|css)$/
const IMAGE_REGEX = /\.(?:png|gif|jpg|jpeg|webp|svg)$/

declare global {
  interface Window {
    __WB_MANIFEST: { url: string; revision: string }[]
  }
}

precacheAndRoute(self.__WB_MANIFEST, {})

// api
registerRoute(/_c/, new NetworkFirst())

// google fonts
registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new StaleWhileRevalidate({ cacheName: 'google-fonts-stylesheets' })
)

registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 20,
        // cache for a year
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  })
)

// image assets
registerRoute(
  IMAGE_REGEX,
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        // cache for 30 days
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  })
)

// javascript and css
registerRoute(
  JS_CSS_REGEX,
  new (process.env.NODE_ENV === 'development'
    ? NetworkOnly
    : StaleWhileRevalidate)({
    cacheName: 'static-resources',
  })
)

if (process.env.NODE_ENV !== 'development') {
  registerRoute(/^https:\/\/(www\.)?cramkle\.com/, new NetworkFirst())
}
