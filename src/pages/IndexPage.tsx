import { useQuery } from '@apollo/client'
import { lazy } from 'react'

import Shell from '../components/Shell'
import { UserContext } from '../components/UserContext'
import type { UserQuery } from '../components/__generated__/UserQuery'
import USER_QUERY from '../components/userQuery.gql'

const HomePage = lazy(() => import('./HomePage'))
const LandingPage = lazy(() => import('./LandingPage'))

export default function IndexPage() {
  const { data, loading } = useQuery<UserQuery>(USER_QUERY, {
    errorPolicy: 'ignore',
  })

  if (loading) {
    return 'Loading...'
  }

  let content = null

  if (data?.me != null) {
    content = (
      <Shell>
        <HomePage />
      </Shell>
    )
  } else {
    content = <LandingPage />
  }

  return <UserContext user={data?.me ?? undefined}>{content}</UserContext>
}
