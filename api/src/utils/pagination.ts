import { base64, unbase64 } from './base64'

export type ConnectionCursor = string

export interface ForwardConnectionArgs {
  after: ConnectionCursor | null
  first: number | null
}

export interface BackwardConnectionArgs {
  before: ConnectionCursor | null
  last: number | null
}

export interface ConnectionArgs
  extends ForwardConnectionArgs,
    BackwardConnectionArgs {}

export interface PageConnectionArgs {
  page: number
  size: number
}

/**
 * A type designed to be exposed as `PageInfo` over GraphQL.
 */
export type PageInfo = {
  startCursor: ConnectionCursor | null
  endCursor: ConnectionCursor | null
  hasPreviousPage: boolean | null
  hasNextPage: boolean | null
}

/**
 * A type designed to be exposed as a `Connection` over GraphQL.
 */
export type Connection<T> = {
  edges: Array<Edge<T>>
  pageInfo: PageInfo
}

/**
 * A type designed to be exposed as a `Edge` over GraphQL.
 */
export interface Edge<T> {
  node: T
  cursor: ConnectionCursor
}

const PREFIX = 'arrayconnection:'

/**
 * Creates the cursor string from an offset.
 */
export function offsetToCursor(offset: number): ConnectionCursor {
  return base64(PREFIX + offset)
}

/**
 * Rederives the offset from the cursor string.
 */
export function cursorToOffset(cursor: ConnectionCursor): number {
  return parseInt(unbase64(cursor).substring(PREFIX.length), 10)
}

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

/**
 * Return the cursor associated with an object in an array.
 */
export function cursorForObjectInConnection<T>(
  data: readonly T[],
  object: T
): string | null {
  const offset = data.indexOf(object)
  if (offset === -1) {
    return null
  }
  return offsetToCursor(offset)
}

/**
 * Given an optional cursor and a default offset, returns the offset
 * to use; if the cursor contains a valid offset, that will be used,
 * otherwise it will be the default.
 */
export function getOffsetWithDefault(
  cursor: ConnectionCursor | null,
  defaultOffset: number
): number {
  if (typeof cursor !== 'string') {
    return defaultOffset
  }
  const offset = cursorToOffset(cursor)
  return isNaN(offset) ? defaultOffset : offset
}

interface ArraySliceMetaInfo {
  sliceStart: number
  arrayLength: number
}

/**
 * Given a slice (subset) of an array, returns a connection object for use in
 * GraphQL.
 *
 * This function is similar to `connectionFromArray`, but is intended for use
 * cases where you know the cardinality of the connection, consider it too large
 * to materialize the entire array, and instead wish pass in a slice of the
 * total result large enough to cover the range specified in `args`.
 */
export function connectionFromArraySlice<T>(
  arraySlice: readonly T[],
  args: Partial<ConnectionArgs>,
  meta: ArraySliceMetaInfo
): Connection<T> {
  const { after, before, first, last } = args
  const { sliceStart, arrayLength } = meta
  const sliceEnd = sliceStart + arraySlice.length
  const beforeOffset = getOffsetWithDefault(before ?? null, arrayLength)
  const afterOffset = getOffsetWithDefault(after ?? null, -1)

  let startOffset = Math.max(sliceStart - 1, afterOffset, -1) + 1
  let endOffset = Math.min(sliceEnd, beforeOffset, arrayLength)
  if (first != null) {
    if (first < 0) {
      throw new Error('Argument "first" must be a non-negative integer')
    }

    endOffset = Math.min(endOffset, startOffset + first)
  }
  if (last != null) {
    if (last < 0) {
      throw new Error('Argument "last" must be a non-negative integer')
    }

    startOffset = Math.max(startOffset, endOffset - last)
  }

  // If supplied slice is too large, trim it down before mapping over it.
  const slice = arraySlice.slice(
    Math.max(startOffset - sliceStart, 0),
    arraySlice.length - (sliceEnd - endOffset)
  )

  const edges = slice.map((value, index) => ({
    cursor: offsetToCursor(startOffset + index),
    node: value,
  }))

  const firstEdge = edges[0]
  const lastEdge = edges[edges.length - 1]
  const lowerBound = after ? afterOffset + 1 : 0
  const upperBound = before ? beforeOffset : arrayLength

  return {
    edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasPreviousPage: last != null ? startOffset > lowerBound : false,
      hasNextPage: first != null ? endOffset < upperBound : false,
    },
  }
}

/**
 * A simple function that accepts an array and connection arguments, and returns
 * a connection object for use in GraphQL. It uses array offsets as pagination,
 * so pagination will only work if the array is static.
 */
export function connectionFromArray<T>(
  data: readonly T[],
  args: Partial<ConnectionArgs>
) {
  return connectionFromArraySlice(data, args, {
    sliceStart: 0,
    arrayLength: data.length,
  })
}

/**
 * A version of `connectionFromArray` that takes a promised array, and returns a
 * promised connection.
 */
export function connectionFromPromisedArray<T>(
  dataPromise: Promise<readonly T[]>,
  args: Partial<ConnectionArgs>
): Promise<Connection<T>> {
  return dataPromise.then((data) => connectionFromArray(data, args))
}

/**
 * A version of `connectionFromArraySlice` that takes a promised array slice,
 * and returns a promised connection.
 */
export function connectionFromPromisedArraySlice<T>(
  dataPromise: Promise<readonly T[]>,
  args: Partial<ConnectionArgs>,
  arrayInfo: ArraySliceMetaInfo
): Promise<Connection<T>> {
  return dataPromise.then((data) =>
    connectionFromArraySlice(data, args, arrayInfo)
  )
}
