import { useQuery } from '@apollo/react-hooks'
import * as React from 'react'
import { Outlet } from 'react-router'

import Redirect from '../components/Redirect'
import { UserContext } from '../components/UserContext'
import type { UserQuery } from '../components/__generated__/UserQuery'
import USER_QUERY from '../components/userQuery.gql'

interface Input {
  challenge: (user: UserQuery['me']) => boolean
  redirectPath: string
  displayName: string
  appendReturnUrl?: boolean
}

export const createRoute = ({
  challenge,
  redirectPath,
  displayName,
  appendReturnUrl,
}: Input) => {
  const RouteComponent: React.FC = ({ children }) => {
    const { data, loading } = useQuery<UserQuery>(USER_QUERY, {
      errorPolicy: 'ignore',
    })

    if (loading) {
      return null
    }

    if (challenge(data?.me ?? null)) {
      return (
        <>
          <UserContext user={data!.me!}>{children}</UserContext>
        </>
      )
    }

    return (
      <Redirect
        to={redirectPath}
        {...(appendReturnUrl ? { appendReturnUrl } : undefined)}
      />
    )
  }

  const CustomRoute: React.VFC = () => {
    return (
      <RouteComponent>
        <Outlet />
      </RouteComponent>
    )
  }

  CustomRoute.displayName = displayName

  return CustomRoute
}
