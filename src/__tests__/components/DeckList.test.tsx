import * as React from 'react'
import { render } from 'react-testing-library'
import { createStore } from 'redux'

import rootReducer from '../../rootReducer'
import DeckList from '../../components/DeckList'

describe('<DeckList />', () => {
  it('should match snapshot', () => {
    const dummyStore = createStore(rootReducer)

    const component = render(<DeckList store={dummyStore} />)

    expect(component.container).toMatchSnapshot()
  })
})
