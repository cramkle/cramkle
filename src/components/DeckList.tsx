import { useQuery } from '@apollo/react-hooks'
import { Trans } from '@lingui/macro'
import classNames from 'classnames'
import gql from 'graphql-tag'
import React from 'react'

import useTopBarLoading from '../hooks/useTopBarLoading'
import DeckCard, { deckCardFragment } from './DeckCard'
import styles from './DeckList.css'
import { DecksQuery } from './__generated__/DecksQuery'
import { Body1, Headline1 } from './views/Typography'

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
    <>
      <Headline1 className="mt-4">
        <Trans>Your decks</Trans>
      </Headline1>
      <div className="py-4">
        <div className={classNames(styles.grid, 'grid gap-4')}>
          {decks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </div>
      </div>
    </>
  )
}

export default DeckList
