import { ActionTypes } from '../types'

export const fetchUser = token => ({
  type: ActionTypes.FETCH_CURRENT_USER_REQUEST,
  token,
})

export const fetchUserSuccess = user => ({
  type: ActionTypes.FETCH_CURRENT_USER_SUCCESS,
  user,
})

export const fetchUserFailure = () => ({
  type: ActionTypes.FETCH_CURRENT_USER_FAILURE,
})

export const registerNewUser = (user, meta) => ({
  type: ActionTypes.REGISTER_NEW_USER_REQUEST,
  user,
  meta,
})

export const registerNewUserSuccess = user => ({
  type: ActionTypes.REGISTER_NEW_USER_SUCCESS,
  user,
})

export const registerNewUserFailure = () => ({
  type: ActionTypes.REGISTER_NEW_USER_FAILURE,
})

