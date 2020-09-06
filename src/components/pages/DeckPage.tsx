import { useQuery } from '@apollo/react-hooks'
import { Trans, plural } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import gql from 'graphql-tag'
import React, { useCallback, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory, useLocation, useParams } from 'react-router'

import useLatestRefEffect from '../../hooks/useLatestRefEffect'
import usePaginationParams from '../../hooks/usePaginationParams'
import useTopBarLoading from '../../hooks/useTopBarLoading'
import BackButton from '../BackButton'
import DeleteDeckButton from '../DeleteDeckButton'
import NotesTable from '../NotesTable'
import Container from '../views/Container'
import {
  Body1,
  Body2,
  Caption,
  Headline1,
  Headline2,
  Headline3,
} from '../views/Typography'
import { DeckQuery, DeckQueryVariables } from './__generated__/DeckQuery'

export const DECK_QUERY = gql`
  query DeckQuery($slug: String!, $page: Int!, $size: Int!, $search: String) {
    deck(slug: $slug) {
      id
      slug
      title
      description
      totalNotes
      totalFlashcards
      notes(page: $page, size: $size, search: $search)
      @connection(key: "Deck_notes", filter: ["page", "size", "search"]) {
        totalCount
        edges {
          node {
            id
            text
            model {
              name
            }
            flashCards {
              id
              active
              status
              due
              template {
                name
              }
            }
            deck {
              title
            }
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        pageCursors {
          first {
            cursor
            page
            isCurrent
          }
          around {
            cursor
            page
            isCurrent
          }
          last {
            cursor
            page
            isCurrent
          }
          previous {
            cursor
            page
            isCurrent
          }
        }
      }
    }
  }
`

const DeckPage: React.FunctionComponent = () => {
  const { i18n } = useLingui()
  const { slug } = useParams<{ slug: string }>()
  const location = useLocation()
  const history = useHistory()
  const {
    paginationParams,
    pageSize,
    onPaginationChange,
  } = usePaginationParams()

  const [searchInputValue, setSearchInputValue] = useState(() => {
    const searchParams = new URLSearchParams(location.search)

    if (searchParams.has('search')) {
      return searchParams.get('search')
    }

    return ''
  })

  const [searchVariable, setSearchVariable] = useState(searchInputValue)

  const { data, loading, refetch } = useQuery<DeckQuery, DeckQueryVariables>(
    DECK_QUERY,
    {
      variables: { slug, search: searchVariable, ...paginationParams },
      fetchPolicy: 'cache-and-network',
    }
  )

  const searchDebounceRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const handleSearchSubmit = useCallback(
    (search = searchInputValue, skipHistoryPush = false) => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current)
      }

      const searchParams = new URLSearchParams(location.search)

      searchParams.set('search', search)

      if (!skipHistoryPush) {
        history.push(location.pathname + '?' + searchParams.toString())
      }

      setSearchVariable(search)
    },
    [history, location.pathname, location.search, searchInputValue]
  )

  useLatestRefEffect(location.search, (latestLocationSearch) => {
    const searchParams = new URLSearchParams(latestLocationSearch)

    const search = searchParams.has('search') ? searchParams.get('search') : ''

    setSearchInputValue(search)
    handleSearchSubmit(search, true)
  })

  const handleRefetchNotes = () => {
    refetch()
  }

  const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (evt) => {
      const search = evt.target.value
      setSearchInputValue(search)
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current)
      }

      searchDebounceRef.current = setTimeout(() => {
        handleSearchSubmit(search)
      }, 500)
    },
    [handleSearchSubmit]
  )

  useTopBarLoading(loading)

  if (!data) {
    return null
  }

  const { deck } = data

  return (
    <>
      <Helmet title={deck.title} />
      <Container>
        <BackButton to="/decks" />

        <div className="flex flex-col mb-8">
          <div className="flex justify-between items-baseline">
            <Headline1>
              <Trans>Deck details</Trans>
            </Headline1>

            <DeleteDeckButton deckId={deck.id} />
          </div>
          <Headline2 className="mt-4">{deck.title}</Headline2>
          {deck.description && (
            <Body1 className="mt-2 whitespace-pre-line">
              {deck.description}
            </Body1>
          )}
          <Body2 className="mt-4">
            {i18n._(
              plural(deck.totalNotes, { one: '# note', other: '# notes' })
            )}
            <span className="inline-block mx-1">&middot;</span>
            {i18n._(
              plural(deck.totalFlashcards, {
                one: '# flashcard',
                other: '# flashcards',
              })
            )}
          </Body2>
        </div>

        <Headline3>
          <Trans>Notes</Trans>{' '}
          <Caption className="ml-1">
            <Trans>({deck.notes.totalCount} notes)</Trans>
          </Caption>
        </Headline3>

        <div className="mt-4 mb-8">
          <NotesTable
            totalDeckNotes={deck.totalNotes}
            notes={deck.notes}
            deckSlug={deck.slug}
            onPaginationChange={onPaginationChange}
            pageSize={pageSize}
            searchQuery={searchInputValue}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
            onRefetchNotes={handleRefetchNotes}
          />
        </div>
      </Container>
    </>
  )
}

export default DeckPage
