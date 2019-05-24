import { setupI18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import React, { StrictMode } from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import ReactDOM from 'react-dom'
import { Helmet } from 'react-helmet'
import { StaticRouterContext } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import Cookies from 'universal-cookie'

import App from './App'
import registerSW from './registerSW'
import { HintsProvider } from './components/HintsContext'
import catalogEn from './locales/en/messages'
import catalogPt from './locales/pt/messages'
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

  const i18n = setupI18n()

  i18n.load('en', catalogEn)
  i18n.load('pt', catalogPt)

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
      const [{ renderToStringWithData }, { StaticRouter }] = await Promise.all([
        import('@apollo/react-ssr'),
        import('react-router-dom'),
      ])

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
  // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
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
