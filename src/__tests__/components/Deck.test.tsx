import * as React from 'react'
import { render } from 'react-testing-library'

import Deck from '../../components/Deck'

describe('<Deck />', () => {
  it('should match snapshot', () => {
    const dummyDeck = {
      deckId: 1,
      title: 'Dummy',
    }

    const component = render(<Deck {...dummyDeck} />)

    expect(component.container).toMatchSnapshot()
  })
})
