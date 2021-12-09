import { gql, useQuery } from '@apollo/client'
import { Plural, Trans } from '@lingui/macro'
import classnames from 'classnames'
import * as React from 'react'

import type { PageCursors, PageInfo } from '../components/Pagination'
import { Pagination } from '../components/Pagination'
import PublishedDeckCard, {
  publishedDeckCardFragment,
} from '../components/PublishedDeckCard'
import { useCurrentUser } from '../components/UserContext'
import { Container } from '../components/views/Container'
import { Body1, Headline1 } from '../components/views/Typography'
import { usePaginationParams } from '../hooks/usePaginationParams'
import styles from './MarketplaceSection.module.css'
import type {
  PublishedDecksQuery,
  PublishedDecksQueryVariables,
  PublishedDecksQuery_publishedDecks_edges_node,
} from './__generated__/PublishedDecksQuery'

export const PUBLISHED_DECK_QUERY = gql`
  query PublishedDecksQuery($page: Int!, $size: Int!) {
    publishedDecks(page: $page, size: $size) {
      totalCount
      edges {
        node {
          id
          ...PublishedDeckCard_deck
        }
      }
      pageCursors {
        first {
          cursor
          page
          isCurrent
        }
        last {
          cursor
          page
          isCurrent
        }
        around {
          isCurrent
          cursor
          page
        }
        previous {
          isCurrent
          page
          cursor
        }
      }
      pageInfo {
        endCursor
        startCursor
        hasPreviousPage
        hasNextPage
      }
    }
  }

  ${publishedDeckCardFragment}
`

const MarketplacePage: React.FunctionComponent = () => {
  const { paginationParams, pageSize, onPaginationChange } =
    usePaginationParams()
  const me = useCurrentUser()

  const { data, loading } = useQuery<
    PublishedDecksQuery,
    PublishedDecksQueryVariables
  >(PUBLISHED_DECK_QUERY, {
    variables: paginationParams,
    fetchPolicy: 'cache-and-network',
  })

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
    decks: PublishedDecksQuery_publishedDecks_edges_node[]
  ): PublishedDecksQuery_publishedDecks_edges_node[] => {
    return decks.filter((deck) => deck.owner.username !== me.username)
  }

  const decks = filterUserPublishedDecks(
    data.publishedDecks.edges.map((e) => e.node)
  )
  const pageInfo = data.publishedDecks.pageInfo as PageInfo
  const pageCursors = data.publishedDecks.pageCursors as PageCursors

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

          <div className="mt-4">
            <Pagination
              pageInfo={pageInfo}
              pageCursors={pageCursors}
              onChange={onPaginationChange}
              pageSize={pageSize}
            />
          </div>
        </div>
      )}
    </Container>
  )
}

export default MarketplacePage
