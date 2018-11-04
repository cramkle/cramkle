import React from 'react'
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

  if (ctx.url) {
    res.writeHead(302, {
      Location: ctx.url,
    })
  } else {
    res.write(ok({ markup }))
  }

  res.end()
}

export default render
