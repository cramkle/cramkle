import { compose, not, isNil } from 'ramda'
import React from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { graphql, ChildProps } from 'react-apollo'

import USER_QUERY from '../userQuery.gql'
import { UserQuery } from '../__generated__/UserQuery'

interface Input {
  challenge: (user: UserQuery['me']) => boolean
  redirectPath: string
  displayName: string
}

const withUser = graphql<RouteProps, UserQuery>(USER_QUERY)

type SupportedRouteProps = Pick<
  RouteProps,
  Exclude<keyof RouteProps, 'children'>
>

const createRoute = ({ challenge, redirectPath, displayName }: Input) => {
  const CustomRoute: React.FunctionComponent<
    ChildProps<SupportedRouteProps, UserQuery>
  > = ({ data: { me, loading }, render, component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props => {
        if (loading) {
          return null
        }

        if (challenge(me)) {
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

  return withUser(CustomRoute)
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
