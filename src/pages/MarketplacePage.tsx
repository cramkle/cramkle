import { gql, useQuery } from '@apollo/client'
import { Plural, Trans } from '@lingui/macro'
import classnames from 'classnames'
import * as React from 'react'

import PublishedDeckCard, {
  publishedDeckCardFragment,
} from '../components/PublishedDeckCard'
import { useCurrentUser } from '../components/UserContext'
import { Container } from '../components/views/Container'
import { Body1, Headline1 } from '../components/views/Typography'
import styles from './MarketplaceSection.module.css'
import type {
  PublishedDecksQuery,
  PublishedDecksQuery_publishedDecks,
} from './__generated__/PublishedDecksQuery'

export const PUBLISHED_DECK_QUERY = gql`
  query PublishedDecksQuery {
    publishedDecks {
      id
      ...PublishedDeckCard_deck
    }
  }

  ${publishedDeckCardFragment}
`

const MarketplacePage: React.FunctionComponent = () => {
  const me = useCurrentUser()
  const { loading, data } = useQuery<PublishedDecksQuery>(PUBLISHED_DECK_QUERY)

  if (loading) {
    return (
      <div className="py-4">
        <span className="text-txt text-opacity-text-primary">
          <Trans>Loading decks</Trans>
        </span>
      </div>
    )
  }

  const filterUserPublishedDecks = (
    decks: PublishedDecksQuery_publishedDecks[]
  ): PublishedDecksQuery_publishedDecks[] => {
    return decks.filter((deck) => deck.owner!.username !== me.username)
  }

  const decks = filterUserPublishedDecks(data!.publishedDecks)

  return (
    <Container className="py-4">
      <Headline1 className="mt-6 leading-none text-txt text-opacity-text-primary">
        <Trans>Marketplace</Trans>
      </Headline1>

      <div className="flex items-center mt-6">
        {decks && decks.length > 0 && (
          <Body1 className="text-txt text-opacity-text-secondary font-medium">
            <Plural
              value={decks.length}
              zero="# decks"
              one="# deck"
              other="# decks"
            />
          </Body1>
        )}
      </div>

      {!decks || decks.length === 0 ? (
        <Body1 className="mt-8 text-txt text-opacity-text-primary">
          <Trans>There are not any published decks yet.</Trans>
        </Body1>
      ) : (
        <div className="mt-6 mb-4">
          <div className={classnames(styles.grid, 'grid gap-4')}>
            {decks.map((deck) => (
              <PublishedDeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        </div>
      )}
    </Container>
  )
}

export default MarketplacePage
