import { call, put } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import { map, head } from 'ramda'

import { userLoggedIn, userLoginFailure, userLoggedOut } from '../actions/auth'
import {
  registerNewUserSuccess,
  registerNewUserFailure,
  fetchUserSuccess,
  fetchUserFailure,
} from '../actions/user'
import { UserLoginRequestAction } from '../actions/auth'
import setAuthorizationHeader from '../utils/setAuthorizationHeader'
import api from '../api'

const storeToken = token => {
  localStorage.userToken = token
}

const removeToken = () => {
  localStorage.removeItem('userToken')
}

export function* registerUserSaga(action) {
  const { user, meta: { setSubmitting, setErrors } } = action

  try {
    const savedUser = yield call(api.user.register, user)
    yield put(registerNewUserSuccess(savedUser))
    yield put(push('/login'))
  } catch (e) {
    yield call(setSubmitting, false)
    yield call(setErrors, map(head, e.response.data))
    yield put(registerNewUserFailure())
  }
}

export function* userLogoutSaga() {
  yield call(removeToken)
  yield call(setAuthorizationHeader, null)
  yield put(userLoggedOut())
  yield put(push('/login'))
}

export function* fetchUserSaga(action) {
  const { token } = action

  try {
    const user = yield call(api.user.currentUser)
    yield put(userLoggedIn(token))
    yield put(fetchUserSuccess(user))
  } catch (e) {
    yield put(fetchUserFailure())
    yield* userLogoutSaga()
  }
}

export function* userLoginSaga(action) {
  const { credentials, meta: { setSubmitting, setErrors } } = action
  try {
    const { accessToken: token } = yield call(api.user.login, credentials)
    yield call(storeToken, token)
    yield call(setAuthorizationHeader, token)
    yield* fetchUserSaga({ token })
    yield put(push('/dashboard'))
  } catch (e) {
    yield call(setSubmitting, false)
    yield call(setErrors, { authentication: e.message })
    yield put(userLoginFailure())
  }
}

