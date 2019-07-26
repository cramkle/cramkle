/* env: webworker */

import { precacheAndRoute } from 'workbox-precaching'
import { Plugin as CacheableResponsePlugin } from 'workbox-cacheable-response'
import { Plugin as ExpirationPlugin } from 'workbox-expiration'
import {
  NetworkFirst,
  StaleWhileRevalidate,
  CacheFirst,
  NetworkOnly,
} from 'workbox-strategies'
import { registerRoute } from 'workbox-routing'

const JS_CSS_REGEX = /\.(?:js|css)$/
const IMAGE_REGEX = /\.(?:png|gif|jpg|jpeg|webp|svg)$/

declare global {
  interface Window {
    __WB_MANIFEST: { url: string; revision: string }[]
  }
}

precacheAndRoute(self.__WB_MANIFEST, {})

const networkFirstHandler = new NetworkFirst().handle

// api
registerRoute(/_c/, networkFirstHandler)

// google fonts
registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  }).handle
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
  }).handle
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
  }).handle
)

// javascript and css
registerRoute(
  JS_CSS_REGEX,
  new (process.env.NODE_ENV === 'development'
    ? NetworkOnly
    : StaleWhileRevalidate)({
    cacheName: 'static-resources',
  }).handle
)

if (process.env.NODE_ENV === 'development') {
  registerRoute(/(__webpack_hmr|hot-update)/, new NetworkOnly().handle)
} else {
  registerRoute(/^https:\/\/(www\.)?cramkle\.com/, networkFirstHandler)
}
