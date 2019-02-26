import {
  initialState as topBarInitialState,
  queries as topBarQueries,
  mutations as topBarMutations,
} from './topBar'

export default {
  defaults: {
    ...topBarInitialState,
  },
  resolvers: {
    Query: {
      ...topBarQueries,
    },
    Mutation: {
      ...topBarMutations,
    },
  },
}
