import { Trans } from '@lingui/macro'
import { Grid, Row, Cell } from '@material/react-layout-grid'
import { Body1 } from '@material/react-typography'
import gql from 'graphql-tag'
import React, { useEffect } from 'react'
import { compose, graphql, ChildProps } from 'react-apollo'

import DeckCard from './DeckCard'
import { DecksQuery } from './__generated__/DecksQuery'
import loadingMutation from '../graphql/topBarLoadingMutation.gql'

export const DECKS_QUERY = gql`
  query DecksQuery {
    decks {
      id
      slug
      title
      description
    }
  }
`

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
        <Body1 className="mt4">
          <Trans>The decks you create will appear here.</Trans>
        </Body1>
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
  graphql<{}, DecksQuery>(DECKS_QUERY),
  graphql<{}>(loadingMutation)
)(DeckList)
