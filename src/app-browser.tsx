/// <reference types="react/experimental" />
/// <reference types="react-dom/experimental" />

import { RootBrowser } from '@casterly/components/browser'
import { i18n } from '@lingui/core'
import { en as enPlural, pt as ptPlural } from 'make-plural/plurals'
import type { ReactElement } from 'react'
import ReactDOM from 'react-dom'
import { HelmetProvider } from 'react-helmet-async'
import Cookies from 'universal-cookie'

import App from './App'
import { createRelayEnvironment } from './RelayEnvironment'
import { createApolloClient } from './utils/apolloClient'

declare module 'react-dom' {
  // `alpha` stable version of react-dom renamed
  // `unstable_createRoot` to `hydrateRoot`
  function hydrateRoot(
    container: Element | Document | DocumentFragment | Comment,
    element: ReactElement
  ): Root
}

const cookies = new Cookies()
const language = cookies.get('language') || 'en'

i18n.loadLocaleData({ en: { plurals: enPlural }, pt: { plurals: ptPlural } })

const apolloClient = createApolloClient('/_c/graphql')
const relayEnvironment = createRelayEnvironment('/_c/graphql')

try {
  const sentryDsn = process.env.CASTERLY_PUBLIC_SENTRY_DSN

  if (typeof sentryDsn !== 'undefined') {
    import('@sentry/react').then((Sentry) => {
      Sentry.init({
        dsn: sentryDsn,
      })
    })
  }
} catch {
  // ignore
}

import(/* webpackChunkName: "locale" */ `./locales/${language}/messages`).then(
  (catalog) => {
    i18n.load(language, catalog.messages)

    i18n.activate(language)

    ReactDOM.hydrateRoot(
      document.getElementById('root')!,
      <RootBrowser appContext={{ relayEnvironment, apolloClient }}>
        <HelmetProvider>
          <App
            apolloClient={apolloClient}
            userAgent={navigator.userAgent}
            i18n={i18n}
            userPreferredTheme={window.__theme}
            relayEnvironment={relayEnvironment}
          />
        </HelmetProvider>
      </RootBrowser>
    )
  }
)

if (process.env.NODE_ENV === 'production') {
  import('./registerSW').then(({ default: registerSW }) => {
    registerSW()
  })
}
