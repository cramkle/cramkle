import React from 'react'
import { graphql } from 'react-apollo'
import { Caption } from '@material/react-typography'

import Deck from './Deck'
import decksQuery from '../graphql/decksQuery.gql'

const DeckList = ({ data: { loading, decks = [] } }) => {
  if (loading) {
    return <p>loading...</p>
  }

  if (decks.length === 0) {
    return (
      <Caption>
        You haven&apos;t created any decks yet
      </Caption>
    )
  }

  return (
    <div className="mdc-layout-grid">
      <Caption>Decks</Caption>

      <div className="mdc-layout-grid__inner">
        {decks.map(deck => (
          <div key={deck.id} className="mdc-layout-grid__cell">
            <Deck {...deck} />
          </div>
        ))}
      </div>
    </div>
  )
}

DeckList.defaultProps = {
  loading: true,
}

export default graphql(decksQuery)(DeckList)
