import { Action } from 'redux'
import { FormikActions } from 'formik'
import { ActionTypes, UserCredentials } from '../types'

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

export interface UserLoginRequestAction extends Action {
  credentials: UserCredentials
  meta: FormikActions<UserCredentials>
}

export const userLoginRequest = (
  credentials,
  meta
): UserLoginRequestAction => ({
  type: ActionTypes.USER_LOGIN_REQUEST,
  credentials,
  meta,
})
