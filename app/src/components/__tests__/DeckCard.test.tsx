import { render } from '@testing-library/react'
import DeckCard from 'components/DeckCard'
import React from 'react'
import { MemoryRouter } from 'react-router'

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
