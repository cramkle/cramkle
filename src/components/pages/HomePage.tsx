import Icon from '@material/react-material-icon'
import LinearProgress from '@material/react-linear-progress'
import Tab from '@material/react-tab'
import TabBar from '@material/react-tab-bar'
import React, { useState, useEffect, Suspense, lazy } from 'react'
import { Helmet } from 'react-helmet'
import { withRouter, RouteComponentProps } from 'react-router'

const StudySection = lazy(() => import('./StudySection'))
const DecksSection = lazy(() => import('./DecksSection'))
const TemplatesSection = lazy(() => import('./TemplatesSection'))

const getTabBarIndexFromPathname = (pathname: string) => {
  switch (pathname) {
    case '/templates':
      return 2
    case '/decks':
      return 1
    default:
    case '/home':
      return 0
  }
}

const HomePage: React.FunctionComponent<RouteComponentProps> = ({
  history,
  location,
  match,
}) => {
  const [index, setIndex] = useState(() =>
    getTabBarIndexFromPathname(location.pathname)
  )

  useEffect(() => {
    setIndex(getTabBarIndexFromPathname(location.pathname))
  }, [location.pathname])

  const handleActiveIndexUpdate = (index: number) => {
    setIndex(index)
  }

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <div className="h-100 flex flex-column">
        <TabBar
          activeIndex={index}
          handleActiveIndexUpdate={handleActiveIndexUpdate}
        >
          <Tab onClick={() => history.push('/home')}>
            <Icon className="mdc-tab__icon mr3" icon="school" />
            Study
          </Tab>
          <Tab onClick={() => history.push('/decks')}>
            <Icon className="mdc-tab__icon mr3" icon="style" />
            Decks
          </Tab>
          <Tab onClick={() => history.push('/templates')}>
            <Icon className="mdc-tab__icon mr3" icon="flip_to_back" />
            Templates
          </Tab>
        </TabBar>

        <Suspense fallback={<LinearProgress indeterminate />}>
          <div hidden={match.path !== '/home'}>
            <StudySection />
          </div>
          <div hidden={match.path !== '/decks'}>
            <DecksSection />
          </div>
          <div hidden={match.path !== '/templates'}>
            <TemplatesSection />
          </div>
        </Suspense>
      </div>
    </>
  )
}

export default withRouter(HomePage)
