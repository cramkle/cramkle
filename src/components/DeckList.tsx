import React, { useEffect } from 'react'
import { compose, graphql, ChildProps } from 'react-apollo'
import { Body1 } from '@material/react-typography'
import { Grid, Row, Cell } from '@material/react-layout-grid'

import DeckCard from './DeckCard'
import decksQuery from '../graphql/decksQuery.gql'
import { DecksQuery } from '../graphql/__generated__/DecksQuery'
import loadingMutation from '../graphql/topBarLoadingMutation.gql'

const DeckList: React.FunctionComponent<ChildProps<{}, DecksQuery>> = ({
  data: { loading, decks = [] },
  mutate,
}) => {
  useEffect(() => {
    mutate({ variables: { loading } })
  }, [loading, mutate])

  if (loading) {
    return null
  }

  if (decks.length === 0) {
    return (
      <div className="flex flex-column items-center">
        <Body1 className="mt4">The decks you create will appear here.</Body1>
      </div>
    )
  }

  return (
    <Grid className="w-100">
      <Row>
        {decks.map(deck => (
          <Cell key={deck.id}>
            <DeckCard {...deck} />
          </Cell>
        ))}
      </Row>
    </Grid>
  )
}

export default compose(
  graphql<{}, DecksQuery>(decksQuery),
  graphql<{}>(loadingMutation)
)(DeckList)
