import React, { useEffect } from 'react'
import { compose, graphql } from 'react-apollo'
import { Caption } from '@material/react-typography'

import Deck from './Deck'
import decksQuery from '../graphql/decksQuery.gql'
import loadingMutation from '../graphql/topBarLoadingMutation.gql'

const DeckList = ({ data: { loading, decks = [] }, mutate }) => {
  useEffect(
    () => {
      mutate({ variables: { loading } })
    },
    [loading]
  )

  if (loading) {
    return null
  }

  if (decks.length === 0) {
    return <Caption>You haven&apos;t created any decks yet</Caption>
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

export default compose(
  graphql(decksQuery),
  graphql(loadingMutation)
)(DeckList)
