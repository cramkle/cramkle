import fs from 'fs'
import path from 'path'

import { renderToStringWithData } from '@apollo/react-ssr'
import { Scripts, Styles } from '@casterly/components'
import { RootServer } from '@casterly/components/server'
import { i18n } from '@lingui/core'
import { en as enPlural, pt as ptPlural } from 'make-plural/plurals'
import { renderToString } from 'react-dom/server'
import { Helmet } from 'react-helmet'
import serializeJavascript from 'serialize-javascript'

import linguiConfig from './.linguirc.json'
import App from './src/App'
import { RedirectError } from './src/components/Redirect'
import enCatalog from './src/locales/en/messages'
import ptCatalog from './src/locales/pt/messages'
import { createApolloClient } from './src/utils/apolloClient'

const ROUTES_WITHOUT_JAVASCRIPT = ['/about']

const locales = linguiConfig.locales.sort()

const getLanguageLocaleFile = (() => {
  const files = fs
    .readdirSync(
      path.join(fs.realpathSync(process.cwd()), '.dist/static/chunks')
    )
    .filter((fileName) => fileName.match(/locale\d+\.\w+\.js$/))

  return (language: string) => {
    const languageIndex = locales.indexOf(language)
    if (process.env.NODE_ENV === 'production') {
      return `/static/chunks/${files[languageIndex]}`
    }

    return `/static/chunks/locale${languageIndex}.js`
  }
})()

export default async function handleRequest(
  request: Request,
  statusCode: number,
  headers: Headers,
  context: unknown
) {
  const language = request.headers.get('x-cramkle-lang')!

  i18n.load('en', enCatalog.messages)
  i18n.load('pt', ptCatalog.messages)

  i18n.loadLocaleData({ en: { plurals: enPlural }, pt: { plurals: ptPlural } })

  i18n.activate(language)

  const cookie = request.headers.get('cookie') ?? undefined

  const host = process.env.API_HOST ?? `http://${request.headers.get('host')}`

  const client = createApolloClient(`${host}/_c/graphql`, cookie)

  const root = (
    <RootServer context={context} url={request.url}>
      <App
        i18n={i18n}
        userAgent={request.headers.get('userAgent')!}
        apolloClient={client}
      />
    </RootServer>
  )

  try {
    const content = await renderToStringWithData(root)

    const state = client.extract()

    const head = Helmet.rewind()

    const rootContainer = (
      <RootServer context={context} url={request.url}>
        <html {...head.htmlAttributes.toComponent()}>
          <head>
            <meta charSet="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
            {head.meta.toComponent()}
            {head.title.toComponent()}
            {head.base.toComponent()}
            {head.link.toComponent()}
            <Styles />
          </head>
          <body {...head.bodyAttributes.toComponent()}>
            {head.script.toComponent()}
            {head.noscript.toComponent()}
            <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
            <script
              dangerouslySetInnerHTML={{
                __html:
                  'window.__APOLLO_STATE__ = ' + serializeJavascript(state),
              }}
            />
            {!ROUTES_WITHOUT_JAVASCRIPT.includes(request.url) && (
              <>
                <script defer src={getLanguageLocaleFile(language)} />
                <Scripts />
              </>
            )}
          </body>
        </html>
      </RootServer>
    )

    const rootContent = renderToString(rootContainer)

    return new Response('<!doctype html>' + rootContent, {
      status: statusCode,
      headers: {
        ...Object.fromEntries((headers as unknown) as [string, string][]),
        'content-type': 'text/html',
      },
    })
  } catch (err) {
    if (err instanceof RedirectError) {
      return new Response(null, {
        status: 302,
        headers: {
          location: `${err.url}${
            err.appendReturnUrl
              ? `?returnUrl=${encodeURIComponent(request.url)}`
              : ''
          }`,
        },
      })
    }

    throw err
  }
}
