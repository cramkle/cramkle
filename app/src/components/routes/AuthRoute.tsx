import { useQuery } from '@apollo/react-hooks'
import React, { ReactElement } from 'react'
import { useLocation } from 'react-router'
import { Redirect, Route, RouteProps } from 'react-router-dom'

import USER_QUERY from '../userQuery.gql'
import { UserQuery } from '../__generated__/UserQuery'

interface Input {
  challenge: (user: UserQuery['me']) => boolean
  redirectPath: string
  displayName: string
}

type SupportedRouteProps = Pick<
  RouteProps,
  Exclude<keyof RouteProps, 'render' | 'component'>
>

const createRoute = ({ challenge, redirectPath, displayName }: Input) => {
  const RouteComponent: React.FC = ({ children }) => {
    const location = useLocation()
    const { data, loading } = useQuery<UserQuery>(USER_QUERY, {
      errorPolicy: 'ignore',
    })

    if (loading) {
      return null
    }

    if (challenge(data.me)) {
      return children as ReactElement
    }

    return (
      <Redirect
        to={{
          pathname: redirectPath,
          state: { from: location },
        }}
      />
    )
  }

  const CustomRoute: React.FunctionComponent<SupportedRouteProps> = ({
    children,
    ...routeProps
  }) => {
    return (
      <Route {...routeProps}>
        <RouteComponent>{children}</RouteComponent>
      </Route>
    )
  }

  CustomRoute.displayName = displayName

  return CustomRoute
}

export const GuestRoute = createRoute({
  challenge: user => user == null,
  redirectPath: '/home',
  displayName: 'GuestRoute',
})

export const UserRoute = createRoute({
  challenge: user => user != null,
  redirectPath: '/login',
  displayName: 'UserRoute',
})
