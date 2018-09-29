import { ActionTypes } from '../types'

const initialState = {
  decks: [],
  loading: false,
}

export default function deck(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.FETCH_DECKS_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case ActionTypes.FETCH_DECKS_SUCCESS:
      return {
        ...state,
        decks: action.decks,
        loading: false,
      }
    default:
      return state
  }
}
