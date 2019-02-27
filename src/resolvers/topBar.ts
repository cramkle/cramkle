const __NAME__ = 'TopBar'

export const initialState = {
  topBar: {
    loading: false,
    __typename: __NAME__,
  },
}

export const queries = {}

export const mutations = {
  setTopBarLoading: (_, { loading }, { cache }) => {
    const data = {
      topBar: {
        loading,
        __typename: __NAME__,
      },
    }

    cache.writeData({ data })

    return null
  },
}
