import React from 'react'
import { Route, RouteProps } from 'react-router-dom'

import Shell from '../Shell'

interface Props extends RouteProps {
  // eslint-disable-next-line
  RouteComponent: React.ComponentType<any>
}

const ShellRoute: React.FunctionComponent<Props> = ({
  RouteComponent,
  path,
  exact,
  ...props
}) => (
  <Route path={path} exact={exact}>
    {({ match }) =>
      match ? (
        <Shell>
          <RouteComponent {...props} />
        </Shell>
      ) : null
    }
  </Route>
)

ShellRoute.defaultProps = {
  exact: false,
  path: undefined,
  RouteComponent: Route,
}

export default ShellRoute
