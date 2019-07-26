/* env: webworker */

import { precacheAndRoute } from 'workbox-precaching'
import {
  networkFirst,
  staleWhileRevalidate,
  cacheFirst,
  networkOnly,
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

const networkFirstHandler = networkFirst({}).handle

// api
registerRoute(/_c/, networkFirstHandler)

// google fonts
registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  staleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  }).handle
)

registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  cacheFirst({
    cacheName: 'google-fonts-webfonts',
    cacheableResponse: {
      statuses: [0, 200],
    },
    expiration: {
      maxEntries: 20,
      // cache for a year
      maxAgeSeconds: 60 * 60 * 24 * 365,
    },
  }).handle
)

// image assets
registerRoute(
  IMAGE_REGEX,
  cacheFirst({
    cacheName: 'images',
    expiration: {
      maxEntries: 60,
      // cache for 30 days
      maxAgeSeconds: 60 * 60 * 24 * 30,
    },
  }).handle
)

// javascript and css
registerRoute(
  JS_CSS_REGEX,
  (process.env.NODE_ENV === 'development' ? networkOnly : staleWhileRevalidate)(
    {
      cacheName: 'static-resources',
    }
  ).handle
)

if (process.env.NODE_ENV === 'development') {
  registerRoute(/(__webpack_hmr|hot-update)/, networkOnly({}).handle)
} else {
  registerRoute(/^https:\/\/(www\.)?cramkle\.com/, networkFirstHandler)
}
