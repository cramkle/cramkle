import { combineReducers } from 'redux'

import userReducer from './reducers/user'
import deckReducer from './reducers/deck'

const rootReducer = combineReducers({
  user: userReducer,
  deck: deckReducer,
})

export default rootReducer
