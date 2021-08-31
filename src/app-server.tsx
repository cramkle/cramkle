import fs from 'fs'
import path from 'path'
import type { Writable } from 'stream'

import { renderToStringWithData } from '@apollo/client/react/ssr'
import type { RootContext } from '@casterly/components'
import { Scripts, Styles } from '@casterly/components'
import { RootServer } from '@casterly/components/server'
import { i18n } from '@lingui/core'
import { en as enPlural, pt as ptPlural } from 'make-plural/plurals'
import type { ReactElement } from 'react'
import { Suspense } from 'react'
import { pipeToNodeWritable } from 'react-dom/server'
import type { FilledContext } from 'react-helmet-async'
import { HelmetProvider } from 'react-helmet-async'
import serializeJavascript from 'serialize-javascript'

import linguiConfig from '../lingui.config'
import App from './App'
import { RedirectError } from './components/Redirect'
import { messages as enCatalog } from './locales/en/messages'
import { messages as ptCatalog } from './locales/pt/messages'
import { createApolloClient } from './utils/apolloClient'
import { darkThemeHelmetScript } from './utils/darkThemeScript'
import { icons } from './utils/headLinks'
import { getUserPreferences } from './utils/userPreferences'

declare module 'react-dom/server' {
  interface StreamOptions {
    startWriting(): void
    abort(): void
  }

  interface StreamConfig {
    onReadyToStream(): void
    onError(error: Error): void
  }

  function pipeToNodeWritable(
    element: ReactElement,
    writable: Writable,
    config: StreamConfig
  ): StreamOptions
}

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
  context: RootContext,
  { responseStream }: { responseStream: Writable }
) {
  const cookie = request.headers.get('cookie') ?? undefined
  const apiHost = process[ENV].API_HOST ?? request.headers.get('host')
  const baseApiUrl = `http://${apiHost}`
  const client = createApolloClient(`${baseApiUrl}/_c/graphql`, cookie)
  const { language, darkMode } = await getUserPreferences(client, request)
  const cspNonce = request.headers.get('x-cramkle-nonce') ?? undefined

  i18n.load('en', enCatalog)
  i18n.load('pt', ptCatalog)

  i18n.loadLocaleData({ en: { plurals: enPlural }, pt: { plurals: ptPlural } })

  i18n.activate(language)

  const helmetContext = {}

  const root = (
    <HelmetProvider context={helmetContext}>
      <Suspense fallback="loading...">
        <App
          i18n={i18n}
          userAgent={request.headers.get('userAgent')!}
          apolloClient={client}
          userPreferredTheme={darkMode ? 'dark' : 'light'}
        />
      </Suspense>
    </HelmetProvider>
  )

  await renderToStringWithData(
    <RootServer context={context} url={request.url}>
      {root}
    </RootServer>
  )

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
            <link key={href} rel={rel} sizes={sizes} href={href} type={type} />
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
              __html: darkThemeHelmetScript(darkMode),
            }}
          />
          <div id="root" className="h-full">
            {root}
          </div>
          <script
            nonce={cspNonce}
            dangerouslySetInnerHTML={{
              __html: 'window.__APOLLO_STATE__ = ' + serializeJavascript(state),
            }}
          />
          <script defer src={getLanguageLocaleFile(language)} />
          <Scripts nonce={cspNonce} />
        </body>
      </html>
    </RootServer>
  )

  let status = statusCode
  let didError = false
  let didRedirect = false
  let location = null

  const startWriting = await new Promise<() => void>((resolve) => {
    const { startWriting } = pipeToNodeWritable(rootContainer, responseStream, {
      onReadyToStream() {
        if (didError) {
          status = 500
        } else if (didRedirect) {
          status = 302
        }

        resolve(startWriting)
      },
      onError(error) {
        if (error instanceof RedirectError) {
          location = `${error.url}${
            error.appendReturnUrl
              ? `?returnUrl=${encodeURIComponent(request.url)}`
              : ''
          }`
          didRedirect = true
        } else {
          didError = true
        }
      },
    })
  })

  return {
    status,
    headers: {
      ...Object.fromEntries(headers as unknown as [string, string][]),
      ...(didRedirect ? { location } : {}),
      'content-type': 'text/html',
      'vary': Array.from(
        new Set(
          ('cookie' + (headers.has('vary') ? ', ' + headers.get('vary')! : ''))
            .split(',')
            .map((header) => header.trim())
        )
      ).join(', '),
    },
    body: didRedirect ? null : responseStream,
    onReadyToStream: () => {
      startWriting()
    },
  }
}
