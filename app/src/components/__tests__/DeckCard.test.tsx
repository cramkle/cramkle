import { render } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router'

import DeckCard from '../DeckCard'

describe('<DeckCard />', () => {
  it('should match snapshot', () => {
    const comp = render(
      <MemoryRouter>
        <DeckCard
          deck={{ id: '123', title: '日本語げんき', slug: 'nihongo-genki' }}
        />
      </MemoryRouter>
    )

    expect(comp.container).toMatchSnapshot()
  })
})
