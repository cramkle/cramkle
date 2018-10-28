import { ActionTypes } from '../types'

export const fetchDecksRequest = () => ({
  type: ActionTypes.FETCH_DECKS_REQUEST,
})

export const fetchDecksSuccess = decks => ({
  type: ActionTypes.FETCH_DECKS_SUCCESS,
  decks,
})

export const fetchDecksFailure = () => ({
  type: ActionTypes.FETCH_DECKS_FAILURE,
})

