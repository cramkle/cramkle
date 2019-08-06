import { useLingui } from '@lingui/react'
import React, { lazy } from 'react'
import ErrorBoundary from 'react-error-boundary'
import { Helmet } from 'react-helmet'
import { Redirect, Route, Switch, withRouter } from 'react-router'
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
          <GuestRoute component={LandingPage} path="/" exact />
          <ShellRoute
            component={HomePage}
            RouteComponent={UserRoute}
            path="/home"
            exact
          />
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
          <ShellRoute
            component={DeckPage}
            RouteComponent={UserRoute}
            path="/d/:slug"
            exact
          />
          <ShellRoute
            component={ModelPage}
            RouteComponent={UserRoute}
            path="/m/:id"
            exact
          />
          <ShellRoute
            component={AddModelPage}
            RouteComponent={UserRoute}
            path="/models/create"
            exact
          />
          <ShellRoute
            component={MarketplacePage}
            RouteComponent={UserRoute}
            path="/marketplace"
            exact
          />
          <ShellRoute
            component={StatisticsPage}
            RouteComponent={UserRoute}
            path="/statistics"
            exact
          />
          <ShellRoute
            component={SettingsPage}
            RouteComponent={UserRoute}
            path="/settings"
            exact
          />
          <GuestRoute component={RegisterPage} path="/register" exact />
          <GuestRoute component={LoginPage} path="/login" exact />
          <Route component={AboutPage} path="/about" exact />
          <Route component={NotFoundPage} />
        </Switch>
      </ErrorBoundary>
    </>
  )
}

export default hot(withRouter(App))
