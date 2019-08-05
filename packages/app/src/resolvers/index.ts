import { Resolvers } from 'apollo-client'

import {
  initialState as topBarInitialState,
  mutations as topBarMutations,
  queries as topBarQueries,
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
