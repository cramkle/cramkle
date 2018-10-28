import React from 'react'
import { Route } from 'react-router-dom'
import { RouteProps } from 'react-router'

import TopBar from '../TopBar'

const TopBarRoute = ({ RouteComponent, path, exact, ...props }) => (
  <Route path={path} exact={exact}>
    {({ match }) =>
      match ? (
        <TopBar>
          <RouteComponent {...props} />
        </TopBar>
      ) : null
    }
  </Route>
)

TopBarRoute.defaultProps = {
  exact: false,
  path: undefined,
  RouteComponent: Route,
}

export default TopBarRoute
