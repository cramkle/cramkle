import React from 'react'
import { MemoryRouter } from 'react-router'
import { render } from 'react-testing-library'

import Deck from '../../components/Deck'

describe('<Deck />', () => {
  it('should match snapshot', () => {
    const comp = render(
      <MemoryRouter>
        <Deck title="日本語げんき" />
      </MemoryRouter>
    )

    expect(comp.container).toMatchSnapshot()
  })
})
