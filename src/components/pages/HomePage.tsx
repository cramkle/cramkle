import Tab from '@material/react-tab'
import TabBar from '@material/react-tab-bar'
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router'

import StudySection from './StudySection'
import DecksSection from './DecksSection'
import TemplatesSection from './TemplatesSection'

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
          <Tab onClick={() => history.push('/home')}>Study</Tab>
          <Tab onClick={() => history.push('/decks')}>Decks</Tab>
          <Tab onClick={() => history.push('/templates')}>Templates</Tab>
        </TabBar>

        <Switch>
          <Route path="/home" component={StudySection} exact />
          <Route path="/decks" component={DecksSection} exact />
          <Route path="/templates" component={TemplatesSection} exact />
        </Switch>
      </div>
    </>
  )
}

export default withRouter(HomePage)
