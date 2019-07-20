import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { createPersistedQueryLink } from 'apollo-link-persisted-queries'
import { ApolloLink } from 'apollo-link'
import { canUseDOM } from 'exenv'

import fetch from './fetch'
import { resolvers, defaults } from '../resolvers'

export const createApolloClient = (uri: string, cookie?: string) => {
  const cache = new InMemoryCache()

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message ${message}, Location: ${locations}, Path ${path}`
        )
      )
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`)
    }
  })

  const persistedQueriesLink = createPersistedQueryLink({
    useGETForHashedQueries: true,
  })

  const httpLink = createHttpLink({
    uri,
    credentials: 'include',
    fetch,
    headers: {
      cookie,
    },
  })

  const client = new ApolloClient({
    ssrMode: !process.browser,
    link: ApolloLink.from([errorLink, persistedQueriesLink, httpLink]),
    resolvers,
    // eslint-disable-next-line no-underscore-dangle
    cache: canUseDOM ? cache.restore(window.__APOLLO_STATE__) : cache,
  })

  cache.writeData({ data: defaults })

  return client
}
