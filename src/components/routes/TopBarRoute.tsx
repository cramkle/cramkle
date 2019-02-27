import React from 'react'
import { Route, RouteProps } from 'react-router-dom'

import TopBar from '../TopBar'

interface Props extends RouteProps {
  RouteComponent: React.Component
}

const TopBarRoute: React.FunctionComponent<Props> = ({ RouteComponent, path, exact, ...props }) => (
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
