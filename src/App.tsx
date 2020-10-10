import { useLingui } from '@lingui/react'
import { ErrorBoundary } from '@sentry/react'
import React, { Suspense, lazy } from 'react'
import { Helmet } from 'react-helmet'
import { hot } from 'react-hot-loader/root'
import { Redirect, Route, Switch } from 'react-router'

import NoSSR from './components/NoSSR'
import NotificationToasts from './components/NotificationToasts'
import AboutPage from './components/pages/AboutPage'
import ForgotPasswordPage from './components/pages/ForgotPasswordPage'
import LandingPage from './components/pages/LandingPage'
import LoginPage from './components/pages/LoginPage'
import NotFoundPage from './components/pages/NotFoundPage'
import RegisterPage from './components/pages/RegisterPage'
import ResetPasswordPage from './components/pages/ResetPasswordPage'
import { GuestRoute, UserRoute } from './components/routes/AuthRoute'
import ShellRoute from './components/routes/ShellRoute'
import { darkThemeHelmetScript } from './utils/darkThemeScript'
import { errorFallback } from './utils/errorFallback'
import { icons } from './utils/headLinks'

import './app.global.scss'
import './_tailwind.global.css'

const AddModelPage = lazy(() => import('./components/pages/AddModelPage'))
const AddNotePage = lazy(() => import('./components/pages/AddNotePage'))
const DeckPage = lazy(() => import('./components/pages/DeckPage'))
const HomePage = lazy(() => import('./components/pages/HomePage'))
const ModelPage = lazy(() => import('./components/pages/ModelPage'))
const NotePage = lazy(() => import('./components/pages/NotePage'))
const SettingsPage = lazy(() => import('./components/pages/SettingsPage'))
const StatisticsPage = lazy(() => import('./components/pages/StatisticsPage'))
const StudyPage = lazy(() => import('./components/pages/StudyPage'))

const App: React.FunctionComponent = () => {
  const { i18n } = useLingui()

  return (
    <>
      <Helmet
        defaultTitle="Cramkle"
        titleTemplate="%s - Cramkle"
        htmlAttributes={{
          lang: i18n.locale,
          // @ts-ignore this works but typescript complains
          style: 'font-size: 16px;',
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
          <ShellRoute RouteComponent={UserRoute} path="/d/:slug/new-note" exact>
            <AddNotePage />
          </ShellRoute>
          <ShellRoute RouteComponent={UserRoute} path="/d/:slug/note/:noteId">
            <NotePage />
          </ShellRoute>
          <UserRoute path="/study/:slug" exact>
            <NoSSR>
              <Suspense fallback={<div className="h-full bg-background" />}>
                <StudyPage />
              </Suspense>
            </NoSSR>
          </UserRoute>
          <ShellRoute RouteComponent={UserRoute} path="/m/:id" exact>
            <ModelPage />
          </ShellRoute>
          <ShellRoute RouteComponent={UserRoute} path="/models/create" exact>
            <AddModelPage />
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
          <GuestRoute path="/forgot-password" exact>
            <ForgotPasswordPage />
          </GuestRoute>
          <GuestRoute path="/reset-password/:userId" exact>
            <ResetPasswordPage />
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
