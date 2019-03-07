import { compose, not, isNil } from 'ramda'
import React from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { graphql, ChildProps } from 'react-apollo'

import userQuery from '../../graphql/userQuery.gql'

interface Data {
  user: object
}

interface Input {
  matches: (user: Data['user']) => boolean
  path: string
  displayName: string
}

const withUser = graphql<RouteProps, Data>(userQuery)

const createRoute = ({ matches, path, displayName }: Input) => {
  const CustomRoute: React.FunctionComponent<ChildProps<RouteProps, Data>> = ({
    data: { user },
    component: Component,
    ...rest
  }) => (
    <Route
      {...rest}
      render={props =>
        matches(user) ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: path,
              // eslint-disable-next-line react/prop-types
              state: { from: props.location },
            }}
          />
        )
      }
    />
  )

  CustomRoute.displayName = displayName

  return withUser(CustomRoute)
}

export const GuestRoute = createRoute({
  matches: isNil,
  path: '/dashboard',
  displayName: 'GuestRoute',
})

export const UserRoute = createRoute({
  matches: compose(
    not,
    isNil
  ),
  path: '/login',
  displayName: 'UserRoute',
})
