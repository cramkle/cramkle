import { ApolloProvider } from '@apollo/react-hooks'
import { Routes } from '@casterly/components'
import { I18nProvider } from '@lingui/react'
import { ErrorBoundary } from '@sentry/react'
import { FC, StrictMode } from 'react'
import { Helmet } from 'react-helmet'

import CramkleToasts from './components/CramkleToasts'
import { HintsProvider } from './components/HintsContext'
import { ThemeProvider } from './components/Theme'
import { darkThemeHelmetScript } from './utils/darkThemeScript'
import { errorFallback } from './utils/errorFallback'
import { icons } from './utils/headLinks'

import './material.global.scss'
import './app.global.scss'
import './_tailwind.global.css'

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
              htmlAttributes={{
                lang: i18n.locale,
                // @ts-ignore this works but typescript complains
                style:
                  typeof window === 'undefined'
                    ? { fontSize: '16px' }
                    : 'font-size: 16px',
              }}
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
              style={[
                {
                  cssText:
                    'html,body{height: 100%;}body{overscroll-behavior-y:none;}',
                },
              ]}
              link={[
                ...icons,
                {
                  rel: 'stylesheet',
                  href:
                    'https://fonts.googleapis.com/css?family=Libre+Franklin:300,400,500,600&display=swap',
                },
                {
                  rel: 'manifest',
                  href: '/manifest.json',
                },
              ]}
              script={[darkThemeHelmetScript]}
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
