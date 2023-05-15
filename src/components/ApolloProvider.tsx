'use client'

import { ApolloProvider as Provider } from '@apollo/client'

import { createApolloClient } from '../utils/apolloClient'

const apolloClient = createApolloClient('/api/graphql')

export const ApolloProvider = ({ children }) => {
  return <Provider client={apolloClient}>{children}</Provider>
}
