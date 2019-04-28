import React from 'react'
import { MemoryRouter } from 'react-router'
import { render } from 'react-testing-library'

import DeckCard from '../DeckCard'

describe('<DeckCard />', () => {
  it('should match snapshot', () => {
    const comp = render(
      <MemoryRouter>
        <DeckCard title="日本語げんき" slug="nihongo-genki" />
      </MemoryRouter>
    )

    expect(comp.container).toMatchSnapshot()
  })
})
