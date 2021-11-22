import type { Environment } from 'react-relay'
import type { ApolloClient } from '@apollo/client'
import type { NormalizedCacheObject } from '@apollo/client/cache'

declare global {
  interface AppContext {
    apolloClient: ApolloClient<NormalizedCacheObject>
    relayEnvironment: Environment
  }
}
