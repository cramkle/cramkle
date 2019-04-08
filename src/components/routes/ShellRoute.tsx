import React from 'react'
import { Route, RouteProps } from 'react-router-dom'

import Shell from '../Shell'

interface Props
  extends Pick<RouteProps, Exclude<keyof RouteProps, 'children' | 'render'>> {
  RouteComponent: React.ComponentType<RouteProps>
}

const ShellRoute: React.FunctionComponent<Props> = ({
  RouteComponent = Route,
  component: Component,
  ...rest
}) => (
  <RouteComponent {...rest}>
    {props => (
      <Shell>
        <Component {...props} />
      </Shell>
    )}
  </RouteComponent>
)

export default ShellRoute
