import type { Resolvers } from 'apollo-client'

const topBarTypename = 'TopBar'

export const initialState = {
  topBar: {
    loading: false,
    __typename: topBarTypename,
  },
}

export const queries = {}

export const mutations: Resolvers['Mutation'] = {
  setTopBarLoading: (_, { loading }, { cache }) => {
    const data = {
      topBar: {
        loading,
        __typename: topBarTypename,
      },
    }

    cache.writeData({ data })

    return null
  },
}
