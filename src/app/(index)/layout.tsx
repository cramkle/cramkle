import HomePage from '@src/components/HomePage'
import LandingPage from '@src/components/LandingPage'
import Shell from '@src/components/Shell'
import type { UserQuery } from '@src/components/__generated__/UserQuery'
import userQuery from '@src/components/userQuery.gql'
import { getServerApolloClient } from '@src/utils/serverApolloClient'

export default async function IndexLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const apolloClient = getServerApolloClient()

  const {
    data: { me: user },
  } = await apolloClient.query<UserQuery>({ query: userQuery })

  const hasCurrentUser = user != null

  if (!hasCurrentUser) {
    return <LandingPage />
  }

  return (
    <Shell>
      <HomePage>{children}</HomePage>
    </Shell>
  )
}
