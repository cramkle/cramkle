import React from 'react'

import { render } from '../../testUtils'
import DeckCard from '../DeckCard'

describe('<DeckCard />', () => {
  it('should match snapshot', () => {
    const comp = render(
      <DeckCard
        deck={{
          __typename: 'Deck',
          id: '123',
          title: '日本語げんき',
          description: '',
          slug: 'nihongo-genki',
          studySessionDetails: {
            __typename: 'StudySessionDetails',
            newCount: 0,
            learningCount: 0,
            reviewCount: 0,
          },
        }}
      />
    )

    expect(comp.container).toMatchSnapshot()
  })
})
