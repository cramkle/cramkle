import { ActionTypes } from '../types'

const initialState = {
  fetching: false,
}

export default function user(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.FETCH_CURRENT_USER_REQUEST:
      return {
        ...state,
        fetching: true,
      }
    case ActionTypes.FETCH_CURRENT_USER_SUCCESS:
      return {
        ...state,
        user: action.user,
        fetching: false,
      }
    case ActionTypes.FETCH_CURRENT_USER_FAILURE:
      return {
        ...state,
        fetching: false,
        user: undefined,
      }
    case ActionTypes.USER_LOGGED_IN:
      return {
        ...state,
        token: action.token,
      }
    case ActionTypes.USER_LOGGED_OUT:
      return {
        ...state,
        token: undefined,
        user: undefined,
      }
    default:
      return state
  }
}

