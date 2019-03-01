import React from 'react'
import { Route, RouteProps } from 'react-router-dom'

import TopBar from '../TopBar'

interface Props extends RouteProps {
  // eslint-disable-next-line
  RouteComponent: React.ComponentType<any>
}

const TopBarRoute: React.FunctionComponent<Props> = ({
  RouteComponent,
  path,
  exact,
  ...props
}) => (
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
