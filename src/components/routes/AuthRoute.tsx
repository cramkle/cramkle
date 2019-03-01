import React from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { graphql } from 'react-apollo'

import userQuery from '../../graphql/userQuery.gql'

interface Data {
  user: object
}

const withUser = graphql<RouteProps, Data>(userQuery)

const createRoute = (matches: (user: Data['user']) => boolean, path: string) =>
  withUser(({ data: { user }, component: Component, ...rest }) => (
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
  ))

export const GuestRoute = createRoute(user => user === null, '/dashboard')

export const UserRoute = createRoute(user => user !== null, '/login')
