import { useQuery } from '@apollo/react-hooks'
import React from 'react'
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
  Exclude<keyof RouteProps, 'children'>
>

const createRoute = ({ challenge, redirectPath, displayName }: Input) => {
  const CustomRoute: React.FunctionComponent<SupportedRouteProps> = ({
    render,
    component: Component,
    ...rest
  }) => {
    const {
      data: { me },
      loading,
    } = useQuery<UserQuery>(USER_QUERY, { errorPolicy: 'ignore' })

    return (
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
