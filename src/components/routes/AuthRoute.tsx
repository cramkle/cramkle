import { compose, not, isNil } from 'ramda'
import React, { memo } from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { graphql, ChildProps } from 'react-apollo'

import userQuery from '../../graphql/userQuery.gql'

interface Data {
  user: object
}

interface Input {
  challenge: (user: Data['user']) => boolean
  redirectPath: string
  displayName: string
}

const withUser = graphql<RouteProps, Data>(userQuery)

type SupportedRouteProps = Pick<
  RouteProps,
  Exclude<keyof RouteProps, 'children'>
>

const createRoute = ({ challenge, redirectPath, displayName }: Input) => {
  const CustomRoute: React.FunctionComponent<
    ChildProps<SupportedRouteProps, Data>
  > = ({ data: { user }, render, component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props => {
        if (challenge(user)) {
          if (typeof render === 'function') {
            return render(props)
          }

          return <Component {...props} />
        }

        return (
          <Redirect
            to={{
              pathname: redirectPath,
              state: { from: props.location },
            }}
          />
        )
      }}
    />
  )

  CustomRoute.displayName = displayName

  return withUser(memo(CustomRoute))
}

export const GuestRoute = createRoute({
  challenge: isNil,
  redirectPath: '/home',
  displayName: 'GuestRoute',
})

export const UserRoute = createRoute({
  challenge: compose(
    not,
    isNil
  ),
  redirectPath: '/login',
  displayName: 'UserRoute',
})
