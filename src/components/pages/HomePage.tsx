import Icon from '@material/react-material-icon'
import Tab from '@material/react-tab'
import TabBar from '@material/react-tab-bar'
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { withRouter, RouteComponentProps, Route, Switch } from 'react-router'

import StudySection from './StudySection'
import DecksSection from './DecksSection'
import ModelsSection from './ModelsSection'

const getTabBarIndexFromPathname = (pathname: string) => {
  switch (pathname) {
    case '/models':
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
          <Tab onClick={() => history.push('/home')}>
            <Icon className="mdc-tab__icon mr3" icon="school" />
            Study
          </Tab>
          <Tab onClick={() => history.push('/decks')}>
            <Icon className="mdc-tab__icon mr3" icon="style" />
            Decks
          </Tab>
          <Tab onClick={() => history.push('/models')}>
            <Icon className="mdc-tab__icon mr3" icon="flip_to_back" />
            Models
          </Tab>
        </TabBar>

        <Switch>
          <Route path="/home" component={StudySection} />
          <Route path="/decks" component={DecksSection} />
          <Route path="/models" component={ModelsSection} />
        </Switch>
      </div>
    </>
  )
}

export default withRouter(HomePage)
