import React from 'react'
import { Route, RouteProps } from 'react-router'

import Shell from '../Shell'

interface Props
  extends Pick<RouteProps, Exclude<keyof RouteProps, 'component' | 'render'>> {
  RouteComponent: React.ComponentType<RouteProps>
}

const ShellRoute: React.FunctionComponent<Props> = ({
  RouteComponent = Route,
  children,
  ...routeProps
}) => (
  <RouteComponent {...routeProps}>
    <Shell>{children}</Shell>
  </RouteComponent>
)

export default ShellRoute
