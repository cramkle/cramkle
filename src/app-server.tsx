import fs from 'fs'
import path from 'path'
import type { Readable, Writable } from 'stream'

import { renderToStringWithData } from '@apollo/client/react/ssr'
import type { RootContext } from '@casterly/components'
import { Scripts } from '@casterly/components'
import { RootServer } from '@casterly/components/server'
import { i18n } from '@lingui/core'
import { en as enPlural, pt as ptPlural } from 'make-plural/plurals'
import type { ReactElement } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
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
    onCompleteShell?(): void
    onCompleteAll?(): void
    onError(error: Error): void
  }

  function renderToPipeableStream(
    element: ReactElement,
    config: StreamConfig
  ): Readable
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
  context: RootContext
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
      <App
        i18n={i18n}
        userAgent={request.headers.get('userAgent')!}
        apolloClient={client}
        userPreferredTheme={darkMode ? 'dark' : 'light'}
      />
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
    </RootServer>
  )

  let status = statusCode
  let didError = false
  let didRedirect = false
  let location = null

  let stream

  await new Promise<void>((resolve) => {
    const reactStream = renderToPipeableStream(rootContainer, {
      onCompleteShell() {
        if (didError) {
          status = 500
        } else if (didRedirect) {
          status = 302
        }

        resolve()
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

          if (process.env.NODE_ENV === 'development') {
            console.error(error)
          }
        }
      },
    })

    stream = {
      ...reactStream,
      pipe(writable: Writable) {
        writable.write(
          `<!doctype html><html lang="${i18n.locale}" style="font-size: 16px;">`
        )
        writable.write('<head>')

        // collect head and insert in writable
        writable.write('<meta charSet="utf-8">')
        writable.write(
          '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">'
        )
        context.matchedRoutesAssets
          .concat(context.mainAssets)
          .forEach((assetName) => {
            const href = process.env.ASSET_PATH + assetName.slice(1)
            const linkType = assetName.endsWith('.js') ? 'script' : 'style'

            writable.write(
              `<link rel="preload" as="${linkType}" href="${href}">`
            )
          })

        const localeFile = getLanguageLocaleFile(language)

        writable.write(`<link rel="preload" as="script" href="${localeFile}">`)

        writable.write(helmet.title.toString())
        writable.write(helmet.meta.toString())
        writable.write(helmet.link.toString())

        icons.forEach(({ rel, sizes, href, type }) => {
          writable.write(
            `<link rel="${rel}" sizes="${sizes}" href="${href}" type="${type}">`
          )
        })

        writable.write('<link rel="manifest" href="/manifest.json">')
        writable.write(
          `<style nonce="${cspNonce}">html,body{height:100%;}body{overscroll-behavior-y:none;}</style>`
        )

        context.matchedRoutesAssets
          .concat(context.mainAssets)
          .filter((assetName) => assetName.endsWith('.css'))
          .forEach((asset) => {
            writable.write(
              `<link rel="stylesheet" type="text/css" href="${
                '/_casterly' + asset
              }">`
            )
          })

        // finish head and let react stream the rest
        writable.write('</head><body>')

        reactStream.pipe(writable)
      },
    }
  })

  return {
    status,
    headers: {
      ...Object.fromEntries(headers as unknown as [string, string][]),
      ...(didRedirect ? { location } : {}),
      'content-type': 'text/html',
      'vary': Array.from(
        new Set([
          'cookie',
          ...(headers
            .get('vary')
            ?.split(',')
            .map((value) => value.trim()) ?? []),
        ])
      ).join(', '),
    },
    body: didRedirect ? null : stream,
  }
}
