import React from 'react'
import { graphql } from 'react-apollo'

import Deck from './Deck'
import decksQuery from '../graphql/decksQuery.gql'

const DeckList = ({ data: { loading, decks } }) => {
  if (loading) {
    return <p>loading...</p>
  }

  if (decks.length === 0) {
    return (
      <p className="mdc-typography--caption">
        You haven&apos;t created any decks yet
      </p>
    )
  }

  return (
    <div className="mdc-layout-grid">
      <p className="mdc-typography--caption">Decks</p>

      <div className="mdc-layout-grid__inner">
        {decks.map(deck => (
          <div key={deck.deckId} className="mdc-layout-grid__cell">
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
