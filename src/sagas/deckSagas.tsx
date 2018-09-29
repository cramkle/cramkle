import { SagaIterator } from 'redux-saga'
import { call, put } from 'redux-saga/effects'

import { fetchDecksSuccess, fetchDecksFailure } from '../actions/deck'
import api from '../api'

// eslint-disable-next-line import/prefer-default-export
export function* fetchDecksSaga(): SagaIterator {
  try {
    const decks = yield call(api.deck.getAll)
    yield put(fetchDecksSuccess(decks))
  } catch (e) {
    yield put(fetchDecksFailure())
  }
}
