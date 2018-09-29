import { call, put } from 'redux-saga/effects'
import { fetchDecksSaga } from '../../sagas/deckSagas'
import { fetchDecksSuccess } from '../../actions/deck'
import api from '../../api'

it('should get all decks', () => {
  const gen = fetchDecksSaga()

  expect(gen.next().value).toEqual(call(api.deck.getAll))

  const decks = []

  expect(gen.next(decks).value).toEqual(put(fetchDecksSuccess(decks)))

  expect(gen.next().done).toBe(true)
})
