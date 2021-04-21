/// <reference types="react/experimental" />
/// <reference types="react-dom/experimental" />

import { RootBrowser } from '@casterly/components/browser'
import { i18n } from '@lingui/core'
import * as Sentry from '@sentry/react'
import { en as enPlural, pt as ptPlural } from 'make-plural/plurals'
import ReactDOM from 'react-dom'
import { HelmetProvider } from 'react-helmet-async'
import Cookies from 'universal-cookie'

import App from './src/App'
import registerSW from './src/registerSW'
import { createApolloClient } from './src/utils/apolloClient'

const cookies = new Cookies()
const language = cookies.get('language') || 'en'

i18n.loadLocaleData({ en: { plurals: enPlural }, pt: { plurals: ptPlural } })

const apolloClient = createApolloClient('/_c/graphql')

try {
  if (process.env.CASTERLY_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.CASTERLY_PUBLIC_SENTRY_DSN,
    })
  }
} catch {
  // ignore
}

const reactRoot = ReactDOM.unstable_createRoot(
  document.getElementById('root')!,
  {
    hydrate: true,
  }
)

import(
  /* webpackChunkName: "locale" */ `./src/locales/${language}/messages`
).then((catalog) => {
  i18n.load(language, catalog.default.messages)

  i18n.activate(language)

  reactRoot.render(
    <RootBrowser>
      <HelmetProvider>
        <App
          apolloClient={apolloClient}
          userAgent={navigator.userAgent}
          i18n={i18n}
        />
      </HelmetProvider>
    </RootBrowser>
  )
})

if (process.env.NODE_ENV === 'production') {
  registerSW()
}
