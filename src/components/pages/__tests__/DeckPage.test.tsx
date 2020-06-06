import { waitFor } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Route } from 'react-router'

import { render } from '../../../test/utils'
import DeckPage, { DECK_QUERY } from '../DeckPage'
import { DeckQuery } from '../__generated__/DeckQuery'

const deckQueryResultForPage = ({
  page,
  empty = false,
}: {
  page: number
  empty?: boolean
}): DeckQuery => {
  return {
    deck: {
      __typename: 'Deck',
      id: '1234',
      slug: 'deck-1',
      title: 'Deck 1',
      description: '',
      totalNotes: 2,
      totalFlashcards: 2,
      notes: {
        __typename: 'NoteConnection',
        totalCount: empty ? 0 : 1,
        edges: empty
          ? []
          : [
              {
                __typename: 'NoteEdge',
                node: {
                  __typename: 'Note',
                  id: `1234${page}`,
                  text: `note ${page}`,
                  model: {
                    __typename: 'Model',
                    name: 'Model',
                    primaryField: null,
                  },
                  flashCards: [],
                  deck: {
                    __typename: 'Deck',
                    title: 'Deck 1',
                  },
                },
                cursor: `abc123${page}`,
              },
            ],
        pageInfo: {
          __typename: 'PageInfo',
          hasNextPage: page === 1 && !empty,
          endCursor: 'abc1232',
        },
        pageCursors: {
          __typename: 'PageCursors',
          last: null,
          first: null,
          previous: null,
          around: empty
            ? []
            : [
                {
                  __typename: 'PageCursor',
                  cursor: `abc123${page}`,
                  page: 1,
                  isCurrent: page === 1,
                },
                {
                  __typename: 'PageCursor',
                  cursor: `abc123${page + 1}`,
                  page: 2,
                  isCurrent: page === 2,
                },
              ],
        },
      },
    },
  }
}

describe('DeckPage', () => {
  it('correctly syncs pagination with browser history', async () => {
    const history = createMemoryHistory()

    history.push('/d/deck-1?page=1&size=1')

    const { getByText, queryByText } = render(
      <Route path="/d/:slug">
        <DeckPage />
      </Route>,
      {
        history,
        mocks: [
          {
            request: {
              query: DECK_QUERY,
              variables: {
                slug: 'deck-1',
                page: 1,
                size: 1,
                search: '',
              },
            },
            result: { data: deckQueryResultForPage({ page: 1 }) },
          },
          {
            request: {
              query: DECK_QUERY,
              variables: {
                slug: 'deck-1',
                page: 2,
                size: 1,
                search: '',
              },
            },
            result: { data: deckQueryResultForPage({ page: 2 }) },
          },
          {
            request: {
              query: DECK_QUERY,
              variables: {
                slug: 'deck-1',
                page: 2,
                size: 1,
                search: 'my search',
              },
            },
            result: { data: deckQueryResultForPage({ page: 2, empty: true }) },
          },
        ],
      }
    )

    await waitFor(() => expect(getByText('note 1')).toBeInTheDocument())

    history.push('/d/deck-1?page=2&size=1')

    await waitFor(() => expect(getByText('note 2')).toBeInTheDocument())

    history.push('/d/deck-1?page=2&size=1&search=my search')

    await waitFor(() => expect(queryByText('note 1')).toBeNull())

    await waitFor(() => expect(queryByText('note 2')).toBeNull())
  })
})
