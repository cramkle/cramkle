import fs from 'fs'
import path from 'path'

import { renderToStringWithData } from '@apollo/react-ssr'
import { RootContext, Scripts, Styles } from '@casterly/components'
import { RootServer } from '@casterly/components/server'
import { paths } from '@casterly/utils'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { en as enPlural, pt as ptPlural } from 'make-plural/plurals'
import PurgeCSS from 'purgecss'
import { renderToNodeStream, renderToString } from 'react-dom/server'
import { Helmet } from 'react-helmet'
import serializeJavascript from 'serialize-javascript'

import linguiConfig from './.linguirc.json'
import App from './src/App'
import { RedirectError } from './src/components/Redirect'
import enCatalog from './src/locales/en/messages'
import ptCatalog from './src/locales/pt/messages'
import { createApolloClient } from './src/utils/apolloClient'
import { darkThemeHelmetScript } from './src/utils/darkThemeScript'
import { errorFallback } from './src/utils/errorFallback'
import { icons } from './src/utils/headLinks'

const ROUTES_WITHOUT_JAVASCRIPT = ['/about']

const locales = linguiConfig.locales.sort()

const getLanguageLocaleFile = (() => {
  const files = fs
    .readdirSync(
      path.join(fs.realpathSync(process.cwd()), 'build/static/chunks')
    )
    .filter((fileName) => fileName.match(/locale\d+\.\w+\.js$/))

  return (language: string) => {
    const languageIndex = locales.indexOf(language)
    if (process.env.NODE_ENV === 'production') {
      return `${process.env.ASSET_PATH}static/chunks/${files[languageIndex]}`
    }

    return `${process.env.ASSET_PATH}static/chunks/locale${languageIndex}.js`
  }
})()

// hack to avoid DefinePlugin inlining value of `process.env`
const ENV = ('env' + Math.random()).slice(0, 3) as 'env'

const purgeTailwindClasses = (content: string) =>
  content.match(/[A-Za-z0-9-_:/]+/g) ?? []

export default async function handleRequest(
  request: Request,
  statusCode: number,
  headers: Headers,
  context: RootContext
) {
  const language = request.headers.get('x-cramkle-lang')!

  const cspNonce = request.headers.get('x-cramkle-nonce') ?? undefined

  i18n.load('en', enCatalog.messages)
  i18n.load('pt', ptCatalog.messages)

  i18n.loadLocaleData({ en: { plurals: enPlural }, pt: { plurals: ptPlural } })

  i18n.activate(language)

  const cookie = request.headers.get('cookie') ?? undefined

  const apiHost = process[ENV].API_HOST ?? request.headers.get('host')

  const baseApiUrl = `http://${apiHost}`

  const client = createApolloClient(`${baseApiUrl}/_c/graphql`, cookie)

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

    const purgeResult = await new PurgeCSS().purge({
      css: context.mainAssets
        .concat(context.matchedRoutesAssets)
        .filter((file) => file.endsWith('.css'))
        .map((file) => path.join(paths.appBuildFolder, file)),
      content: [
        {
          raw: content,
          extension: 'html',
        },
      ],
      safelist: ['__dark-mode', '__light-mode', 'h-full'],
      extractors: [
        {
          extractor: purgeTailwindClasses,
          extensions: ['html'],
        },
      ],
    })

    const rootContainer = (
      <RootServer context={context} url={request.url}>
        <html lang={i18n.locale} style={{ fontSize: '16px' }}>
          <head>
            <meta charSet="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
            {context.matchedRoutesAssets
              .concat(context.mainAssets)
              .map((assetName) => (
                <link
                  key={assetName}
                  rel="preload"
                  as={assetName.endsWith('.js') ? 'script' : 'style'}
                  href={`${process.env.ASSET_PATH}${assetName.slice(1)}`}
                />
              ))}
            <link
              rel="preload"
              as="script"
              href={getLanguageLocaleFile(language)}
            />
            {head.title.toComponent()}
            {head.meta.toComponent()}
            {head.link.toComponent()}
            {icons.map(({ rel, sizes, href, type }) => (
              <link
                key={href}
                rel={rel}
                sizes={sizes}
                href={href}
                type={type}
              />
            ))}
            <link rel="manifest" href="/manifest.json" />
            <style
              nonce={cspNonce}
              dangerouslySetInnerHTML={{
                __html:
                  'html,body{height: 100%;}body{overscroll-behavior-y:none;}',
              }}
            />
            {purgeResult.map(({ css, file }) => (
              <style
                key={file}
                nonce={cspNonce}
                dangerouslySetInnerHTML={{ __html: css }}
              />
            ))}
            <Styles
              // @ts-ignore: attribute exist in HTML spec
              disabled
              data-ssr-stylesheet=""
            />
            <noscript>
              <Styles />
            </noscript>
          </head>
          <body>
            <script
              nonce={cspNonce}
              dangerouslySetInnerHTML={{
                __html: darkThemeHelmetScript.innerHTML,
              }}
            />
            <div
              id="root"
              className="h-full"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            {!ROUTES_WITHOUT_JAVASCRIPT.includes(request.url) && (
              <>
                <script
                  nonce={cspNonce}
                  dangerouslySetInnerHTML={{
                    __html:
                      'window.__APOLLO_STATE__ = ' + serializeJavascript(state),
                  }}
                />
                <script defer src={getLanguageLocaleFile(language)} />
                <Scripts nonce={cspNonce} />
              </>
            )}
            <script
              nonce={cspNonce}
              dangerouslySetInnerHTML={{
                // Enabling all stylesheets once everything in the page has been loaded.
                __html: `
(function() {
  var disabledStylesheets = document.querySelectorAll('link[data-ssr-stylesheet=""]')

  disabledStylesheets.forEach(function(link) {
    link.disabled = false
  })
})()
`.trim(),
              }}
            />
          </body>
        </html>
      </RootServer>
    )

    const rootContent = renderToNodeStream(rootContainer)

    rootContent.unshift('<!doctype html>')

    return new Response(rootContent as any, {
      status: statusCode,
      headers: {
        ...Object.fromEntries((headers as unknown) as [string, string][]),
        'content-type': 'text/html',
        vary: Array.from(
          new Set(
            (
              'cookie' +
              (headers.has('vary') ? ', ' + headers.get('vary')! : '')
            )
              .split(',')
              .map((header) => header.trim())
          )
        ).join(', '),
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

    return new Response(
      '<!doctype html>' +
        renderToString(
          <RootServer context={context} url={request.url}>
            <html>
              <head>
                <meta charSet="utf-8" />
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <meta name="robots" content="noindex, nofollow" />
                <title>Error</title>
                <style
                  nonce={cspNonce}
                  dangerouslySetInnerHTML={{
                    __html:
                      'html,body{height: 100%;}body{overscroll-behavior-y:none;}',
                  }}
                />
                <Styles />
              </head>
              <body>
                <I18nProvider i18n={i18n}>
                  {errorFallback({ error: err, componentStack: '' })}
                </I18nProvider>
                <script
                  nonce={cspNonce}
                  dangerouslySetInnerHTML={{
                    __html: `
var refreshButton = document.getElementById('refresh-button');

refreshButton.onclick = function() {
  window.location.reload()
};
`.trim(),
                  }}
                />
              </body>
            </html>
          </RootServer>
        ),
      {
        status: 500,
        headers: {
          ...Object.fromEntries((headers as unknown) as [string, string][]),
          'content-type': 'text/html',
        },
      }
    )
  }
}
