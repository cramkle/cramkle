import { ApolloProvider } from '@apollo/react-hooks'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { en as enPlural, pt as ptPlural } from 'make-plural/plurals'
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Helmet } from 'react-helmet'
import { StaticRouterContext } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import Cookies from 'universal-cookie'

import App from './App'
import { HintsProvider } from './components/HintsContext'
import enCatalog from './locales/en/messages'
import ptCatalog from './locales/pt/messages'
import registerSW from './registerSW'
import { createApolloClient } from './utils/apolloClient'

interface RenderOptions {
  requestUrl: string
  requestHost: string
  cookie?: string
  userAgent: string
  requestLanguage: string
}

interface RenderResult {
  markup: string
  routerContext: StaticRouterContext
  state: NormalizedCacheObject
}

const render = ({
  requestUrl,
  requestLanguage,
  userAgent,
  requestHost,
  cookie,
}: RenderOptions): Promise<RenderResult> | void => {
  let language: string

  if (requestLanguage) {
    language = requestLanguage
  } else {
    const cookies = new Cookies()
    language = cookies.get('language') || 'en'
  }

  i18n.load('en', enCatalog.messages)
  i18n.load('pt', ptCatalog.messages)

  i18n.loadLocaleData({ en: { plurals: enPlural }, pt: { plurals: ptPlural } })

  i18n.activate(language)

  const host = requestHost || ''
  const client = createApolloClient(`${host}/_c/graphql`, cookie)

  const root = (
    <StrictMode>
      <I18nProvider i18n={i18n}>
        <ApolloProvider client={client}>
          <HintsProvider userAgent={userAgent}>
            <App />
          </HintsProvider>
        </ApolloProvider>
      </I18nProvider>
    </StrictMode>
  )

  if (typeof window !== 'undefined') {
    const elem = document.getElementById('root')

    const query = new URLSearchParams(window.location.search)

    const shouldHydrate =
      !query.has('nossr') || process.env.NODE_ENV === 'production'

    const method = shouldHydrate ? 'hydrate' : 'render'

    ReactDOM[method](<BrowserRouter>{root}</BrowserRouter>, elem)
  } else {
    const renderWithData = async () => {
      // use dynamic import here to avoid placing these
      // dependencies in the client bundle.
      const { renderToStringWithData } = await import('@apollo/react-ssr')
      const { StaticRouter } = await import('react-router-dom')

      const routerContext = {}

      const rootContainer = (
        <StaticRouter context={routerContext} location={requestUrl}>
          {root}
        </StaticRouter>
      )

      const markup = await renderToStringWithData(rootContainer)
      const state = client.extract()

      return {
        markup,
        routerContext,
        state,
      }
    }

    return renderWithData()
  }
}

export default async function start(opts?: RenderOptions) {
  const maybeRenderResult = await render(opts || ({} as RenderOptions))

  if (!maybeRenderResult) {
    registerSW()
    return
  }

  return {
    ...maybeRenderResult,
    head: Helmet.rewind(),
  }
}
