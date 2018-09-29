import * as React from 'react'
import { render } from 'react-testing-library'
import { createStore } from 'redux'

import rootReducer from '../../rootReducer'
import UserInformationCard from '../../components/UserInformationCard'

describe('<UserInformationCard />', () => {
  it('should match snapshot', () => {
    const dummyStore = createStore(rootReducer)

    const component = render(<UserInformationCard store={dummyStore} />)

    expect(component.container).toMatchSnapshot()
  })
})
