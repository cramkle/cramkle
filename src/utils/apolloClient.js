import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { canUseDOM } from 'exenv'

export const createApolloClient = uri => {
  const cache = new InMemoryCache()

  const client = new ApolloClient({
    ssrMode: process.env.SSR,
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
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
      }),
      new HttpLink({
        uri,
        credentials: 'include',
        fetch: window.fetch,
      }),
    ]),
    // eslint-disable-next-line no-underscore-dangle
    cache: canUseDOM ? cache.restore(window.__APOLLO_STATE__) : cache,
  })

  return client
}

const defaultClient = createApolloClient('http://localhost:5000/graphql')

export default defaultClient
