import { ApolloClient, ApolloLink, createHttpLink } from '@apollo/client'
import { InMemoryCache } from '@apollo/client/cache'
import type { NormalizedCacheObject } from '@apollo/client/cache'
import { onError } from '@apollo/client/link/error'

declare global {
  interface Window {
    __APOLLO_STATE__: NormalizedCacheObject
  }

  namespace NodeJS {
    interface Process {
      browser: boolean
    }
  }
}

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
    fetchOptions: {
      method: 'POST',
    },
  })

  const client = new ApolloClient({
    ssrMode: !process.browser,
    link: ApolloLink.from([errorLink, httpLink]),
    cache:
      typeof window !== 'undefined'
        ? cache.restore(window.__APOLLO_STATE__)
        : cache,
  })

  return client
}
