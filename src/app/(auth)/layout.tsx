import { redirect } from 'next/navigation'

import type { UserQuery } from '@src/components/__generated__/UserQuery'
import userQuery from '@src/components/userQuery.gql'
import { getServerApolloClient } from '@src/utils/serverApolloClient'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const apolloClient = getServerApolloClient()

  const {
    data: { me: user },
  } = await apolloClient.query<UserQuery>({ query: userQuery })

  if (user == null) {
    redirect('/login')
  }

  return children
}
