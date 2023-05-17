import 'server-only'

import { headers } from 'next/headers'

import { createApolloClient } from './apolloClient'

export function getServerApolloClient() {
  const headersList = headers()

  const apiHost = process.env.API_HOST ?? 'http://localhost:5000'

  const apolloClient = createApolloClient(
    `${apiHost}/api/graphql`,
    headersList.get('cookie')
  )

  return apolloClient
}
