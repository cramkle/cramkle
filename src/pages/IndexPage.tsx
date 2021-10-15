import { useQuery } from '@apollo/client'
import { Suspense, lazy } from 'react'

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
      <Suspense fallback="loading">
        <Shell>
          <HomePage />
        </Shell>
      </Suspense>
    )
  } else {
    content = (
      <Suspense fallback="loading">
        <LandingPage />
      </Suspense>
    )
  }

  return <UserContext user={data?.me ?? undefined}>{content}</UserContext>
}
