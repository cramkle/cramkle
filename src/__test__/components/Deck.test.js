import React from 'react'
import { render } from 'react-testing-library'

import Deck from '../../components/Deck'

describe('<Deck />', () => {
  it('should match snapshot', () => {
    const comp = render(<Deck title="日本語げんき" />)

    expect(comp.container).toMatchSnapshot()
  })
})
