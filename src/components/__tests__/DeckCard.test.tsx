import React from 'react'

import { render } from '../../test/utils'
import DeckCard from '../DeckCard'

describe('<DeckCard />', () => {
  it('should match snapshot', () => {
    const comp = render(
      <DeckCard
        deck={{
          __typename: 'Deck',
          id: '123',
          slug: 'nihongo-genki',
          title: '日本語げんき',
          description: '',
          totalNotes: 2000,
          totalFlashcards: 3200,
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
