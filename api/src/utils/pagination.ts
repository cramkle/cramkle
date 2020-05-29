import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import {
  ConnectionConfig,
  GraphQLConnectionDefinitions,
  connectionDefinitions,
  offsetToCursor,
} from 'graphql-relay'

export interface PageConnectionArgs {
  page: number
  size: number
}

export const PageCursorType = new GraphQLObjectType({
  name: 'PageCursor',
  fields: () => ({
    cursor: {
      type: GraphQLNonNull(GraphQLString),
    },
    page: {
      type: GraphQLNonNull(GraphQLInt),
    },
    isCurrent: {
      type: GraphQLNonNull(GraphQLBoolean),
    },
  }),
})

export const PageCursorsType = new GraphQLObjectType({
  name: 'PageCursors',
  fields: () => ({
    first: {
      type: PageCursorType,
      description:
        'Optional, may be included in `around` (if current page is near the beginning).',
    },
    last: {
      type: PageCursorType,
      description:
        'Optional, may be included in `around` (if current page is near the end).',
    },
    around: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(PageCursorType))),
      description: 'Always includes current page',
    },
    previous: { type: PageCursorType },
  }),
})

/**
 * Creates the cursor string from a page and size.
 */
export const pageToCursor = (page: number, size: number) => {
  const offset = (page - 1) * size - 1

  return offsetToCursor(offset)
}

/**
 * Meta object that represents a page and it's corresponding cursor.
 */
export interface PageCursor {
  cursor: string
  page: number
  isCurrent: boolean
}

export interface PageCursors {
  first?: PageCursor
  around: PageCursor[]
  last?: PageCursor
  previous?: PageCursor
}

// Returns an opaque cursor for a page.
function pageToCursorObject(
  page: number,
  currentPage: number,
  size: number
): PageCursor {
  return {
    cursor: pageToCursor(page, size),
    page,
    isCurrent: currentPage === page,
  }
}

// Returns an array of PageCursor objects
// from start to end (page numbers).
function pageCursorsToArray(
  start: number,
  end: number,
  currentPage: number,
  size: number
) {
  let page
  const cursors: PageCursor[] = []
  for (page = start; page <= end; page++) {
    cursors.push(pageToCursorObject(page, currentPage, size))
  }
  return cursors
}

// Returns the total number of pagination results.
export function computeTotalPages(totalRecords: number, size: number) {
  return Math.ceil(totalRecords / size)
}

export function createPageCursors(
  { page: currentPage, size }: PageConnectionArgs,
  totalRecords: number,
  max = 5
) {
  // If max is even, bump it up by 1, and log out a warning.
  if (max % 2 === 0) {
    console.warn(`Max of ${max} passed to page cursors, using ${max + 1}`)
    max = max + 1
  }

  const totalPages = computeTotalPages(totalRecords, size)

  let pageCursors: PageCursors
  // Degenerate case of no records found.
  if (totalPages === 0) {
    pageCursors = { around: [pageToCursorObject(1, 1, size)] }
  } else if (totalPages <= max) {
    // Collection is short, and `around` includes page 1 and the last page.
    pageCursors = {
      around: pageCursorsToArray(1, totalPages, currentPage, size),
    }
  } else if (currentPage <= Math.floor(max / 2) + 1) {
    // We are near the beginning, and `around` will include page 1.
    pageCursors = {
      last: pageToCursorObject(totalPages, currentPage, size),
      around: pageCursorsToArray(1, max - 1, currentPage, size),
    }
  } else if (currentPage >= totalPages - Math.floor(max / 2)) {
    // We are near the end, and `around` will include the last page.
    pageCursors = {
      first: pageToCursorObject(1, currentPage, size),
      around: pageCursorsToArray(
        totalPages - max + 2,
        totalPages,
        currentPage,
        size
      ),
    }
  } else {
    // We are in the middle, and `around` doesn't include the first or last page.
    const offset = Math.floor((max - 3) / 2)
    pageCursors = {
      first: pageToCursorObject(1, currentPage, size),
      around: pageCursorsToArray(
        currentPage - offset,
        currentPage + offset,
        currentPage,
        size
      ),
      last: pageToCursorObject(totalPages, currentPage, size),
    }
  }

  if (currentPage > 1 && totalPages > 1) {
    pageCursors.previous = pageToCursorObject(
      currentPage - 1,
      currentPage,
      size
    )
  }
  return pageCursors
}

export function connectionWithCursorInfo(
  config: ConnectionConfig
): GraphQLConnectionDefinitions {
  return connectionDefinitions({
    ...config,
    connectionFields: {
      pageCursors: {
        type: GraphQLNonNull(PageCursorsType),
        resolve: ({ pageCursors }) => pageCursors,
      },
      totalCount: {
        type: GraphQLInt,
        resolve: ({ totalCount }) => totalCount,
      },
      ...config.connectionFields,
    },
  })
}
