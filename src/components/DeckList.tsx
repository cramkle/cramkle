import React, { useEffect } from 'react'
import { compose, graphql, ChildProps } from 'react-apollo'
import { Caption, Body1 } from '@material/react-typography'
import { Grid, Row, Cell } from '@material/react-layout-grid'

import { IDeck } from '../types/Deck'
import decksQuery from '../graphql/decksQuery.gql'
import loadingMutation from '../graphql/topBarLoadingMutation.gql'
import cardsImage from '../assets/cards.svg'
import Deck from './Deck'

interface Data {
  topBar: {
    loading: boolean
  }
  decks: IDeck[]
}

const DeckList: React.FunctionComponent<ChildProps<{}, Data>> = ({
  data: { loading, decks = [] },
  mutate,
}) => {
  useEffect(() => {
    mutate({ variables: { loading } })
  }, [loading])

  if (loading) {
    return null
  }

  if (decks.length === 0) {
    return (
      <div
        className="flex flex-column items-center"
        style={{ marginTop: 'auto', marginBottom: 'auto' }}
      >
        <img width="64" src={cardsImage} alt="Flashcards" />
        <Body1 className="mt4">You haven&apos;t created any decks yet</Body1>
      </div>
    )
  }

  return (
    <Grid className="w-100">
      <Caption>Decks</Caption>
      <Row>
        {decks.map(deck => (
          <Cell key={deck.id}>
            <Deck {...deck} />
          </Cell>
        ))}
      </Row>
    </Grid>
  )
}

export default compose(
  graphql<{}, Data>(decksQuery),
  graphql<{}, Data>(loadingMutation)
)(DeckList)
