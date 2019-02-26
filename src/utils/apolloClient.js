import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { withClientState } from 'apollo-link-state'
import { canUseDOM } from 'exenv'

import clientResolvers from '../resolvers'

export const createApolloClient = uri => {
  const cache = new InMemoryCache()

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message ${message}, Location: ${locations}, Path ${path}`
        )
      )
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`)
    }
  })

  const localStateLink = withClientState({
    ...clientResolvers,
    cache,
  })

  const httpLink = new HttpLink({
    uri,
    credentials: 'include',
    fetch: window.fetch,
  })

  const client = new ApolloClient({
    ssrMode: process.env.SSR,
    link: ApolloLink.from([errorLink, localStateLink, httpLink]),
    // eslint-disable-next-line no-underscore-dangle
    cache: canUseDOM ? cache.restore(window.__APOLLO_STATE__) : cache,
  })

  return client
}

const defaultClient = createApolloClient('http://localhost:5000/graphql')

export default defaultClient
