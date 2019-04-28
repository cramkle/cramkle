import { Resolvers } from 'apollo-client'

import {
  initialState as topBarInitialState,
  queries as topBarQueries,
  mutations as topBarMutations,
} from './topBar'

export const defaults = {
  ...topBarInitialState,
}

export const resolvers: Resolvers = {
  Query: {
    ...topBarQueries,
  },
  Mutation: {
    ...topBarMutations,
  },
}
