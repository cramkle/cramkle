import { ApolloProvider } from '@apollo/react-hooks'
import { Routes } from '@casterly/components'
import { I18nProvider } from '@lingui/react'
import { ErrorBoundary } from '@sentry/react'
import font100italic from 'fontsource-libre-franklin/files/libre-franklin-latin-100-italic.woff2'
import font100normal from 'fontsource-libre-franklin/files/libre-franklin-latin-100-normal.woff2'
import font200italic from 'fontsource-libre-franklin/files/libre-franklin-latin-200-italic.woff2'
import font200normal from 'fontsource-libre-franklin/files/libre-franklin-latin-200-normal.woff2'
import font300italic from 'fontsource-libre-franklin/files/libre-franklin-latin-300-italic.woff2'
import font300normal from 'fontsource-libre-franklin/files/libre-franklin-latin-300-normal.woff2'
import font400italic from 'fontsource-libre-franklin/files/libre-franklin-latin-400-italic.woff2'
import font400normal from 'fontsource-libre-franklin/files/libre-franklin-latin-400-normal.woff2'
import font500italic from 'fontsource-libre-franklin/files/libre-franklin-latin-500-italic.woff2'
import font500normal from 'fontsource-libre-franklin/files/libre-franklin-latin-500-normal.woff2'
import font600italic from 'fontsource-libre-franklin/files/libre-franklin-latin-600-italic.woff2'
import font600normal from 'fontsource-libre-franklin/files/libre-franklin-latin-600-normal.woff2'
import font700italic from 'fontsource-libre-franklin/files/libre-franklin-latin-700-italic.woff2'
import font700normal from 'fontsource-libre-franklin/files/libre-franklin-latin-700-normal.woff2'
import font800italic from 'fontsource-libre-franklin/files/libre-franklin-latin-800-italic.woff2'
import font800normal from 'fontsource-libre-franklin/files/libre-franklin-latin-800-normal.woff2'
import font900italic from 'fontsource-libre-franklin/files/libre-franklin-latin-900-italic.woff2'
import font900normal from 'fontsource-libre-franklin/files/libre-franklin-latin-900-normal.woff2'
import type { FC } from 'react'
import { StrictMode } from 'react'
import { Helmet } from 'react-helmet-async'

import CramkleToasts from './components/CramkleToasts'
import { HintsProvider } from './components/HintsContext'
import { ThemeProvider } from './components/Theme'
import { errorFallback } from './utils/errorFallback'

import 'fontsource-libre-franklin/latin.css'
import './material.global.scss'
import './app.global.scss'
import './tailwind.global.scss'

const App: FC<{ i18n: any; apolloClient: any; userAgent: string }> = ({
  i18n,
  apolloClient,
  userAgent,
}) => {
  return (
    <StrictMode>
      <I18nProvider i18n={i18n}>
        <ApolloProvider client={apolloClient}>
          <HintsProvider userAgent={userAgent}>
            <Helmet
              defaultTitle="Cramkle"
              titleTemplate="%s - Cramkle"
              meta={[
                {
                  name: 'application-name',
                  content: 'Cramkle',
                },
                {
                  name: 'description',
                  content:
                    'Cramkle helps you boost your knowledge rentention with an ' +
                    'effective flashcard-based studying method, and SRS algorithm.',
                },
                {
                  name: 'keywords',
                  content: 'flashcards,anki,srs,spaced repetition',
                },
                {
                  name: 'theme-color',
                  content: '#ffffff',
                },
              ]}
              link={[
                font100normal,
                font200normal,
                font300normal,
                font400normal,
                font500normal,
                font600normal,
                font700normal,
                font800normal,
                font900normal,
                font100italic,
                font200italic,
                font300italic,
                font400italic,
                font500italic,
                font600italic,
                font700italic,
                font800italic,
                font900italic,
              ].map((fontSrc) => ({
                href: fontSrc,
                rel: 'preload',
                as: 'font',
                type: 'font/woff2',
                crossOrigin: 'anonymous',
              }))}
            />
            <ErrorBoundary fallback={errorFallback}>
              <ThemeProvider>
                <CramkleToasts />
                <Routes />
              </ThemeProvider>
            </ErrorBoundary>
          </HintsProvider>
        </ApolloProvider>
      </I18nProvider>
    </StrictMode>
  )
}

export default App
