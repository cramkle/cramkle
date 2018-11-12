import React from 'react'
import { createRoot } from 'react-dom'
import Helmet from 'react-helmet'
import { BrowserRouter, StaticRouter } from 'react-router-dom'
import { canUseDOM } from 'exenv'

import './theme.scss'

import App from './App'

const renderWithData = comp => {
  const routerContext = {}

  const compWithRouter = (
    <StaticRouter location={window.requestUrl} context={routerContext}>
      {comp}
    </StaticRouter>
  )

  return require('react-apollo').getDataFromTree(compWithRouter).then(() => {
    const markup = require('react-dom/server').renderToString(compWithRouter)

    return {
      markup,
      routerContext,
    }
  })
}

const render = () => {
  const root = <App />

  if (canUseDOM) {
    const elem = document.getElementById('root')

    createRoot(elem, { hydrate: true }).render(
      <BrowserRouter>
        {root}
      </BrowserRouter>
    )
  } else {
    return renderWithData(root)
  }
}

const start = () => {
  const maybeRenderPromise = render()

  if (!canUseDOM) {
    window.rendered = maybeRenderPromise.then(({ markup, routerContext }) => ({
      markup,
      routerContext,
      head: Helmet.rewind(),
    }))
  } else {
    import('./registerServiceWorker')
      .then(({ default: registerServiceWorker }) => {
        registerServiceWorker()
      })
  }
}

start()
