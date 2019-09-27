import { useLingui } from '@lingui/react'
import React, { lazy } from 'react'
import ErrorBoundary from 'react-error-boundary'
import { Helmet } from 'react-helmet'
import { Redirect, Route, Switch } from 'react-router'
import { hot } from 'react-hot-loader/root'

import NotificationToasts from 'components/NotificationToasts'
import ErrorFallback from 'components/ErrorFallback'
import AboutPage from 'pages/AboutPage'
import LandingPage from 'pages/LandingPage'
import LoginPage from 'pages/LoginPage'
import RegisterPage from 'pages/RegisterPage'
import NotFoundPage from 'pages/NotFoundPage'
import ShellRoute from 'routes/ShellRoute'
import { GuestRoute, UserRoute } from 'routes/AuthRoute'
import { icons } from 'utils/headLinks'

import './theme.global.scss'

const HomePage = lazy(() => import('pages/HomePage'))
const DeckPage = lazy(() => import('pages/DeckPage'))
const MarketplacePage = lazy(() => import('pages/MarketplacePage'))
const ModelPage = lazy(() => import('pages/ModelPage'))
const SettingsPage = lazy(() => import('pages/SettingsPage'))
const StatisticsPage = lazy(() => import('pages/StatisticsPage'))
const AddModelPage = lazy(() => import('pages/AddModelPage'))

const App: React.FunctionComponent<{}> = () => {
  const { i18n } = useLingui()

  return (
    <>
      <Helmet
        defaultTitle="Cramkle"
        titleTemplate="%s - Cramkle"
        htmlAttributes={{ lang: i18n.locale, style: 'font-size: 15px;' }}
        bodyAttributes={{ class: 'mdc-typography' }}
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
        ]}
        link={icons}
      />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <NotificationToasts />
        <Switch>
          <GuestRoute path="/" exact>
            <LandingPage />
          </GuestRoute>
          <ShellRoute RouteComponent={UserRoute} path="/home" exact>
            <HomePage />
          </ShellRoute>
          <Redirect
            from="/decks"
            to={{ pathname: '/home', state: { currentTab: 1 } }}
            exact
          />
          <Redirect
            from="/models"
            to={{ pathname: '/home', state: { currentTab: 2 } }}
            exact
          />
          <ShellRoute RouteComponent={UserRoute} path="/d/:slug" exact>
            <DeckPage />
          </ShellRoute>
          <ShellRoute RouteComponent={UserRoute} path="/m/:id" exact>
            <ModelPage />
          </ShellRoute>
          <ShellRoute RouteComponent={UserRoute} path="/models/create" exact>
            <AddModelPage />
          </ShellRoute>
          <ShellRoute RouteComponent={UserRoute} path="/marketplace" exact>
            <MarketplacePage />
          </ShellRoute>
          <ShellRoute RouteComponent={UserRoute} path="/statistics" exact>
            <StatisticsPage />
          </ShellRoute>
          <ShellRoute RouteComponent={UserRoute} path="/settings" exact>
            <SettingsPage />
          </ShellRoute>
          <GuestRoute path="/register" exact>
            <RegisterPage />
          </GuestRoute>
          <GuestRoute path="/login" exact>
            <LoginPage />
          </GuestRoute>
          <Route path="/about" exact>
            <AboutPage />
          </Route>
          <Route>
            <NotFoundPage />
          </Route>
        </Switch>
      </ErrorBoundary>
    </>
  )
}

export default hot(App)
