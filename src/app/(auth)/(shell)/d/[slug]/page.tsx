'use client'

import { gql, useQuery } from '@apollo/client'
import { Trans, plural } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'
import * as React from 'react'

import BackButton from '@src/components/BackButton'
import DeleteDeckButton from '@src/components/DeleteDeckButton'
import { EditDeckButton } from '@src/components/EditDeckButton'
import NotesTable from '@src/components/NotesTable'
import { PublishDeckButton } from '@src/components/PublishDeckButton'
import { useCurrentUser } from '@src/components/UserContext'
import { Container } from '@src/components/views/Container'
import {
  Body1,
  Body2,
  Caption,
  Headline1,
  Headline2,
  Headline3,
} from '@src/components/views/Typography'
import { useLatestRefEffect } from '@src/hooks/useLatestRefEffect'
import { usePaginationParams } from '@src/hooks/usePaginationParams'
import { useTopBarLoading } from '@src/hooks/useTopBarLoading'

import type { DeckQuery, DeckQueryVariables } from './__generated__/DeckQuery'

const DECK_QUERY = gql`
  query DeckQuery($slug: String!, $page: Int!, $size: Int!, $search: String) {
    deck(slug: $slug) {
      id
      slug
      title
      description
      published
      originalDeck {
        id
      }
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

export default function DeckPage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const { i18n } = useLingui()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const { paginationParams, pageSize, onPaginationChange } =
    usePaginationParams()
  const me = useCurrentUser()

  const [searchInputValue, setSearchInputValue] = useState(() => {
    const search = new URLSearchParams(searchParams)

    if (search.has('search')) {
      return search.get('search')
    }

    return ''
  })

  const [searchVariable, setSearchVariable] = useState(searchInputValue)

  const { data, loading, error, refetch } = useQuery<
    DeckQuery,
    DeckQueryVariables
  >(DECK_QUERY, {
    variables: { slug, search: searchVariable, ...paginationParams },
    fetchPolicy: 'cache-and-network',
  })

  const searchDebounceRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const handleSearchSubmit = useCallback(
    (search = searchInputValue, skipHistoryPush = false) => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current)
      }

      const searchParamsCopy = new URLSearchParams(searchParams)

      searchParamsCopy.set('search', search)
      searchParamsCopy.set('page', '1')

      if (!skipHistoryPush) {
        router.push(pathname + '?' + searchParamsCopy.toString())
      }

      setSearchVariable(search)
    },
    [router, pathname, searchParams, searchInputValue]
  )

  useLatestRefEffect(searchParams, (latestLocationSearch) => {
    const searchParamsCopy = new URLSearchParams(latestLocationSearch)

    const search = searchParamsCopy.has('search')
      ? searchParamsCopy.get('search')
      : ''

    setSearchInputValue(search)
    handleSearchSubmit(search, true)
  })

  const handleRefetchNotes = () => {
    refetch()
  }

  const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
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

  if (!data && !error) {
    return null
  }

  if (data?.deck == null) {
    return (
      <div className="flex flex-col items-center justify-center p-4 sm:px-0">
        <Headline2 className="text-center sm:text-left text-txt text-opacity-text-primary">
          <Trans>Deck not found</Trans>
        </Headline2>
        <Link className="mt-8 sm:mt-4 text-primary" href="/">
          <Trans>Go to home</Trans>
        </Link>
      </div>
    )
  }

  const { deck } = data

  return (
    <>
      <Container className="py-4">
        <BackButton to="/decks" />

        <div className="flex flex-col mb-8">
          <div className="flex flex-col md:flex-row justify-between items-baseline">
            <Headline1 className="text-txt text-opacity-text-primary">
              <Trans>Deck details</Trans>
            </Headline1>

            <div className="flex items-center">
              <EditDeckButton deckId={deck.id} deck={deck} />
              {!me.anonymous && deck.originalDeck == null && (
                <PublishDeckButton deckId={deck.id} deck={deck} />
              )}
              <DeleteDeckButton deckId={deck.id} />
            </div>
          </div>
          <Headline2 className="mt-4 text-txt text-opacity-text-primary">
            {deck.title}
          </Headline2>
          {deck.description && (
            <Body1 className="mt-2 whitespace-pre-line text-txt text-opacity-text-primary">
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

        <Headline3 className="text-txt text-opacity-text-primary">
          <Trans>Notes</Trans>{' '}
          <Caption className="ml-1">
            <Trans>({deck.notes?.totalCount ?? 0} notes)</Trans>
          </Caption>
        </Headline3>

        <div className="mt-4 mb-8">
          <NotesTable
            totalDeckNotes={deck.totalNotes}
            notes={
              deck.notes ?? {
                __typename: 'NoteConnection',
                totalCount: 0,
                edges: [],
                pageInfo: {
                  __typename: 'PageInfo',
                  endCursor: null,
                  hasNextPage: false,
                },
                pageCursors: {
                  __typename: 'PageCursors',
                  last: null,
                  first: null,
                  around: [],
                  previous: null,
                },
              }
            }
            deckSlug={deck.slug}
            onPaginationChange={onPaginationChange}
            pageSize={pageSize}
            searchQuery={searchInputValue ?? ''}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
            onRefetchNotes={handleRefetchNotes}
          />
        </div>
      </Container>
    </>
  )
}
