import React from 'react'
import Helmet from 'react-helmet'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'

import { ok } from '../templates'
import App from '../../src/App'

const render = (req, res) => {
  const ctx = {}

  const markup = renderToString(
    <StaticRouter location={req.url} context={ctx}>
      <App />
    </StaticRouter>
  )

  const head = Helmet.rewind()

  if (ctx.url) {
    res.writeHead(302, {
      Location: ctx.url,
    })
  } else {
    res.write(ok({ markup, head }))
  }

  res.end()
}

export default render
