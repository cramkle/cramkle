import { useQuery } from '@apollo/react-hooks'
import { Trans } from '@lingui/macro'
import { Cell, Grid, Row } from '@material/react-layout-grid'
import { Body1 } from '@material/react-typography'
import gql from 'graphql-tag'
import React from 'react'

import DeckCard from './DeckCard'
import { DecksQuery } from './__generated__/DecksQuery'
import useTopBarLoading from '../hooks/useTopBarLoading'

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

const DeckList: React.FunctionComponent = () => {
  const {
    loading,
    data: { decks = [] },
  } = useQuery<DecksQuery>(DECKS_QUERY)

  useTopBarLoading(loading)

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

export default DeckList
