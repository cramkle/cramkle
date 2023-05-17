'use client'

import { ApolloProvider as Provider } from '@apollo/client'
import type { ReactNode } from 'react'

import { createApolloClient } from '../utils/apolloClient'

const apolloClient = createApolloClient('/api/graphql')

export const ApolloProvider = ({ children }: { children: ReactNode }) => {
  return <Provider client={apolloClient}>{children}</Provider>
}
