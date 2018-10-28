import { Action } from 'redux'
import { FormikActions } from 'formik'
import { ActionTypes } from '../types'

export const userLoggedIn = token => ({
  type: ActionTypes.USER_LOGGED_IN,
  token,
})

export const userLoginFailure = () => ({
  type: ActionTypes.USER_LOGIN_FAILURE,
})

export const userLogoutRequest = () => ({
  type: ActionTypes.USER_LOGOUT_REQUEST,
})

export const userLoggedOut = () => ({
  type: ActionTypes.USER_LOGGED_OUT,
})

export const userLoginRequest = (credentials, meta) => ({
  type: ActionTypes.USER_LOGIN_REQUEST,
  credentials,
  meta,
})
