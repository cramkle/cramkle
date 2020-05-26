import { useQuery } from '@apollo/react-hooks'
import { Trans } from '@lingui/macro'
import gql from 'graphql-tag'
import React from 'react'

import useTopBarLoading from '../hooks/useTopBarLoading'
import DeckCard, { deckCardFragment } from './DeckCard'
import { DecksQuery } from './__generated__/DecksQuery'
import { Body1 } from './views/Typography'

export const DECKS_QUERY = gql`
  query DecksQuery {
    decks {
      id
      ...DeckCard_deck
    }
  }

  ${deckCardFragment}
`

const DeckList: React.FunctionComponent = () => {
  const { loading, data } = useQuery<DecksQuery>(DECKS_QUERY)

  const decks = data?.decks

  useTopBarLoading(loading)

  if (loading) {
    return null
  }

  if (!decks || decks.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <Body1 className="mt-8">
          <Trans>The decks you create will appear here.</Trans>
        </Body1>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-12 gap-6">
        {decks.map((deck) => (
          <div
            key={deck.id}
            className="col-span-12 md:col-span-6 xl:col-span-4"
          >
            <DeckCard deck={deck} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default DeckList
