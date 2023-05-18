import HomePage from '@src/components/HomePage'
import Shell from '@src/components/Shell'
import type { UserQuery } from '@src/components/__generated__/UserQuery'
import userQuery from '@src/components/userQuery.gql'
import { getServerApolloClient } from '@src/utils/serverApolloClient'

import LandingPage from './LandingPage'
import StudyPage from './StudyPage'

export default async function IndexPage() {
  const apolloClient = getServerApolloClient()

  const {
    data: { me: user },
  } = await apolloClient.query<UserQuery>({ query: userQuery })

  if (user == null) {
    return <LandingPage />
  }
  return (
    <Shell>
      <HomePage>
        <StudyPage />
      </HomePage>
    </Shell>
  )
}
