import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import type { MemoryHistory } from 'history'
import { createMemoryHistory } from 'history'
import { Route, Routes } from 'react-router'

import { render } from '../../../test/utils'
import DeckPage, { DECK_QUERY } from '../DeckPage'
import type { DeckQuery } from '../__generated__/DeckQuery'

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
  let history: MemoryHistory

  beforeEach(() => {
    history = createMemoryHistory()
  })

  it('correctly syncs pagination with browser history', async () => {
    history.push('/d/deck-1?page=1&size=1')

    const { getByText, queryByText } = render(
      <Routes>
        <Route path="/d/:slug">
          <DeckPage />
        </Route>
      </Routes>,
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

    act(() => history.push('/d/deck-1?page=2&size=1'))

    await waitFor(() => expect(getByText('note 2')).toBeInTheDocument())

    act(() => history.push('/d/deck-1?page=2&size=1&search=my search'))

    await waitFor(() => expect(queryByText('note 1')).toBeNull())

    await waitFor(() => expect(queryByText('note 2')).toBeNull())
  })

  it('should empty search when navigating to page without search query', async () => {
    history.push('/d/deck-1?page=1&size=1&search=my search')

    const { getByText, queryByText } = render(
      <Routes>
        <Route path="/d/:slug">
          <DeckPage />
        </Route>
      </Routes>,
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
                search: 'my search',
              },
            },
            result: { data: deckQueryResultForPage({ page: 1, empty: true }) },
          },
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
        ],
      }
    )

    await waitFor(() => expect(queryByText('note 1')).not.toBeInTheDocument())

    act(() => history.push('/d/deck-1?page=1&size=1'))

    await waitFor(() => expect(getByText('note 1')).toBeInTheDocument())
  })

  it('should return to page 1 after searching', async () => {
    history.push('/d/deck-1')

    const { getByText, queryByText } = render(
      <Routes>
        <Route path="/d/:slug">
          <DeckPage />
        </Route>
      </Routes>,
      {
        history,
        mocks: [
          {
            request: {
              query: DECK_QUERY,
              variables: {
                slug: 'deck-1',
                page: 1,
                size: 10,
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
                size: 10,
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
                page: 1,
                size: 10,
                search: 'test',
              },
            },
            result: { data: deckQueryResultForPage({ page: 1, empty: true }) },
          },
        ],
      }
    )

    await waitFor(() => expect(queryByText('note 1')).toBeInTheDocument())

    const nextPageButton = screen.getByLabelText(/next page/i)

    fireEvent.click(nextPageButton)

    await waitFor(() => expect(getByText('note 2')).toBeInTheDocument())

    const searchBox = screen.getByRole('textbox')

    fireEvent.change(searchBox, { target: { value: 'test' } })

    await waitFor(() => {
      expect(screen.queryByText('note 1')).not.toBeInTheDocument()
      expect(screen.queryByText('note 2')).not.toBeInTheDocument()
    })

    const searchParams = new URLSearchParams(history.location.search)

    expect(searchParams.get('page')).toBe('1')
    expect(searchParams.get('search')).toBe('test')
  })
})
