import { setupI18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { canUseDOM } from 'exenv'
import React, { StrictMode } from 'react'
import { ApolloProvider } from 'react-apollo'
import ReactDOM from 'react-dom'
import { Helmet } from 'react-helmet'
import { BrowserRouter } from 'react-router-dom'
import Cookies from 'universal-cookie'

import App from './App'
import registerSW from './registerSW'
import { HintsProvider } from './components/HintsContext'
import catalogEn from './locales/en/messages'
import catalogPt from './locales/pt/messages'
import client from './utils/apolloClient'

const renderWithData = (
  rootComponent: React.ReactNode
): Promise<RenderResult> => {
  // We use dynamic import here to avoid placing these
  // dependencies in the client bundle.
  return Promise.all([
    import('react-apollo'),
    import('react-dom/server'),
    import('react-router-dom'),
  ]).then(([{ getDataFromTree }, { renderToString }, { StaticRouter }]) => {
    const routerContext = {}

    const root = (
      <StaticRouter context={routerContext} location={window.requestUrl}>
        {rootComponent}
      </StaticRouter>
    )

    return getDataFromTree(root).then(() => {
      const markup = renderToString(root)

      return {
        markup,
        routerContext,
      }
    })
  })
}

const render = (): Promise<RenderResult> | void => {
  let language: string

  if (window.requestLanguage) {
    language = window.requestLanguage
  } else {
    const cookies = new Cookies()
    language = cookies.get('language') || 'en'
  }

  const i18n = setupI18n()

  i18n.load('en', catalogEn)
  i18n.load('pt', catalogPt)

  i18n.activate(language)

  const root = (
    <StrictMode>
      <I18nProvider i18n={i18n}>
        <ApolloProvider client={client}>
          <HintsProvider>
            <App />
          </HintsProvider>
        </ApolloProvider>
      </I18nProvider>
    </StrictMode>
  )

  if (canUseDOM) {
    const elem = document.getElementById('root')

    const query = new URLSearchParams(window.location.search)

    const shouldHydrate =
      !query.has('nossr') || process.env.NODE_ENV === 'production'

    const method = shouldHydrate ? 'hydrate' : 'render'

    ReactDOM[method](<BrowserRouter>{root}</BrowserRouter>, elem)
  } else {
    return renderWithData(root)
  }
}

const start = (): void => {
  const maybeRenderPromise = render()

  if (canUseDOM) {
    registerSW()
  } else {
    window.rendered = (maybeRenderPromise as Promise<RenderResult>).then(
      ({ markup, routerContext }) => ({
        markup,
        routerContext,
        head: Helmet.rewind(),
        state: client.extract(),
      })
    )
  }
}

start()
