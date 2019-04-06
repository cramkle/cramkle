import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Helmet } from 'react-helmet'
import { BrowserRouter } from 'react-router-dom'
import { canUseDOM } from 'exenv'

import client from './utils/apolloClient'
import App from './App'

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
  const root = <App />

  if (canUseDOM) {
    const elem = document.getElementById('root')

    const query = new URLSearchParams(window.location.search)

    const shouldHydrate =
      !query.has('nossr') || process.env.NODE_ENV === 'production'

    // @ts-ignore
    ReactDOM.unstable_createRoot(elem, { hydrate: shouldHydrate }).render(
      <StrictMode>
        <BrowserRouter>{root}</BrowserRouter>
      </StrictMode>
    )
  } else {
    return renderWithData(root)
  }
}

const start = (): void => {
  const maybeRenderPromise = render()

  if (!canUseDOM) {
    window.rendered = (maybeRenderPromise as Promise<RenderResult>).then(
      ({ markup, routerContext }) => ({
        markup,
        routerContext,
        head: Helmet.rewind(),
        state: client.extract(),
      })
    )
  } else {
    // The dynamic import is used here because the code inside `registerServiceWorker`
    // needs access to the `window` object, and since we don't have it on the server,
    // it would just break the build.
    import('./registerServiceWorker').then(
      ({ default: registerServiceWorker }) => {
        registerServiceWorker()
      }
    )
  }
}

start()
