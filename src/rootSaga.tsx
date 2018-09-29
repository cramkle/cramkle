import { takeLatest } from 'redux-saga/effects'

import { ActionTypes } from './types'

import {
  registerUserSaga,
  fetchUserSaga,
  userLoginSaga,
  userLogoutSaga,
} from './sagas/userSagas'

import { fetchDecksSaga } from './sagas/deckSagas'

export default function* rootSaga() {
  yield takeLatest(ActionTypes.REGISTER_NEW_USER_REQUEST, registerUserSaga)
  yield takeLatest(ActionTypes.USER_LOGIN_REQUEST, userLoginSaga)
  yield takeLatest(ActionTypes.FETCH_CURRENT_USER_REQUEST, fetchUserSaga)
  yield takeLatest(ActionTypes.USER_LOGOUT_REQUEST, userLogoutSaga)

  yield takeLatest(ActionTypes.FETCH_DECKS_REQUEST, fetchDecksSaga)
}
