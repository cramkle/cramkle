import { createSelector } from 'reselect'

const userStateSelector = state => state.user

export const isAuthenticatedSelector = createSelector(
  userStateSelector,
  state => !!state.token,
)

export const getUser = createSelector(
  userStateSelector,
  state => state.user,
)

export const isFetching = createSelector(
  userStateSelector,
  state => state.fetching,
)

