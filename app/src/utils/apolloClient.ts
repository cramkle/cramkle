import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { createHttpLink } from 'apollo-link-http'

import { defaults, resolvers } from '../resolvers/index'
import fetch from './fetch'

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
    link: ApolloLink.from([errorLink, httpLink]),
    resolvers,
    cache:
      typeof window !== 'undefined'
        ? cache.restore(window.__APOLLO_STATE__)
        : cache,
  })

  cache.writeData({ data: defaults })

  return client
}
