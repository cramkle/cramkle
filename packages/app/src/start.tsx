import { setupI18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { ApolloClient } from 'apollo-client'
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
import { createApolloClient } from './utils/apolloClient'

interface RenderOptions {
  requestUrl: string
  requestHost: string
  cookie?: string
  userAgent: string
  requestLanguage: string
}

const renderWithData = async <T extends {}>({
  root,
  requestUrl,
  client,
}: {
  root: React.ReactNode
  requestUrl: string
  client: ApolloClient<T>
}): Promise<RenderResult> => {
  // We use dynamic import here to avoid placing these
  // dependencies in the client bundle.
  const [
    { getDataFromTree },
    { renderToString },
    { StaticRouter },
  ] = await Promise.all([
    import('react-apollo'),
    import('react-dom/server'),
    import('react-router-dom'),
  ])

  const routerContext = {}

  const rootContainer = (
    <StaticRouter context={routerContext} location={requestUrl}>
      {root}
    </StaticRouter>
  )

  await getDataFromTree(rootContainer)

  const markup = renderToString(rootContainer)

  return {
    markup,
    routerContext,
    state: client.extract(),
  }
}

const render = ({
  requestUrl,
  requestLanguage,
  userAgent,
  requestHost,
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
  const client = createApolloClient(`${host}/_c/graphql`)

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

  if (canUseDOM) {
    const elem = document.getElementById('root')

    const query = new URLSearchParams(window.location.search)

    const shouldHydrate =
      !query.has('nossr') || process.env.NODE_ENV === 'production'

    const method = shouldHydrate ? 'hydrate' : 'render'

    ReactDOM[method](<BrowserRouter>{root}</BrowserRouter>, elem)
  } else {
    return renderWithData({ root, requestUrl, client })
  }
}

export default function start(opts?: RenderOptions) {
  // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
  const maybeRenderPromise = render(opts || ({} as RenderOptions))

  if (!maybeRenderPromise) {
    registerSW()
    return
  }

  return maybeRenderPromise.then(({ markup, routerContext }) => ({
    markup,
    routerContext,
    head: Helmet.rewind(),
  }))
}
