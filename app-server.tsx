import fs from 'fs'
import path from 'path'

import { renderToStringWithData } from '@apollo/react-ssr'
import { RootContext, Scripts, Styles } from '@casterly/components'
import { RootServer } from '@casterly/components/server'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import gql from 'graphql-tag'
import { en as enPlural, pt as ptPlural } from 'make-plural/plurals'
import { renderToNodeStream, renderToString } from 'react-dom/server'
import { FilledContext, HelmetProvider } from 'react-helmet-async'
import serializeJavascript from 'serialize-javascript'

import linguiConfig from './.linguirc.json'
import App from './src/App'
import { RedirectError } from './src/components/Redirect'
import { UserQuery } from './src/components/__generated__/UserQuery'
import userQuery from './src/components/userQuery.gql'
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

export default async function handleRequest(
  request: Request,
  statusCode: number,
  headers: Headers,
  context: RootContext
) {
  const cookie = request.headers.get('cookie') ?? undefined

  const apiHost = process[ENV].API_HOST ?? request.headers.get('host')

  const baseApiUrl = `http://${apiHost}`

  const client = createApolloClient(`${baseApiUrl}/_c/graphql`, cookie)

  const {
    data: { me: user },
  } = await client.query<UserQuery>({ query: userQuery })

  if (user && user.preferences.locale == null) {
    await client.mutate({
      mutation: gql`
        mutation UpdateUserLocale($locale: String!) {
          updatePreferences(input: { locale: $locale }) {
            user {
              id
              preferences {
                locale
              }
            }
          }
        }
      `,
      variables: {
        locale: request.headers.get('x-cramkle-lang') ?? 'en',
      },
    })
  }

  const language =
    user?.preferences.locale ?? request.headers.get('x-cramkle-lang')!

  const cspNonce = request.headers.get('x-cramkle-nonce') ?? undefined

  i18n.load('en', enCatalog.messages)
  i18n.load('pt', ptCatalog.messages)

  i18n.loadLocaleData({ en: { plurals: enPlural }, pt: { plurals: ptPlural } })

  i18n.activate(language)

  const helmetContext = {}

  const root = (
    <RootServer context={context} url={request.url}>
      <HelmetProvider context={helmetContext}>
        <App
          i18n={i18n}
          userAgent={request.headers.get('userAgent')!}
          apolloClient={client}
        />
      </HelmetProvider>
    </RootServer>
  )

  try {
    const content = await renderToStringWithData(root)

    const state = client.extract()

    const { helmet } = helmetContext as FilledContext

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
            {helmet.title.toComponent()}
            {helmet.meta.toComponent()}
            {helmet.link.toComponent()}
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
            <Styles />
          </head>
          <body>
            <script
              nonce={cspNonce}
              dangerouslySetInnerHTML={{
                __html: darkThemeHelmetScript(user?.preferences.darkMode),
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
