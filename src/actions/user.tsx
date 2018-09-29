import { Action } from 'redux'
import { ActionTypes } from '../types'

export interface FetchUserAction extends Action {
  token: string
}

export const fetchUser = (token): FetchUserAction => ({
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

export interface RegisterUserAction extends Action {
  user: {}
  meta: {
    setSubmitting: (boolean) => {}
    setErrors: (object) => {}
  }
}

export const registerNewUser = (user, meta): RegisterUserAction => ({
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

