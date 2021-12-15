/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FlashCardStatus } from './../../globalTypes'

// ====================================================
// GraphQL query operation: DeckQuery
// ====================================================

export interface DeckQuery_deck_originalDeck {
  __typename: 'Deck'
  /**
   * The ID of an object
   */
  id: string
}

export interface DeckQuery_deck_notes_edges_node_model {
  __typename: 'Model'
  /**
   * Name of this card model (e.g. "Basic", "Basic with Reversed")
   */
  name: string
}

export interface DeckQuery_deck_notes_edges_node_flashCards_template {
  __typename: 'Template'
  /**
   * Name of the template
   */
  name: string
}

export interface DeckQuery_deck_notes_edges_node_flashCards {
  __typename: 'FlashCard'
  /**
   * The ID of an object
   */
  id: string
  /**
   * Whether to be filtered of not.
   *
   * Acts like a logical deletion it when comes to the review.
   */
  active: boolean
  /**
   * Current status of this flashcard.
   */
  status: FlashCardStatus | null
  /**
   * Due date of this flashcard, in a timestamp format.
   */
  due: number | null
  /**
   * Template associated with this flashcard.
   */
  template: DeckQuery_deck_notes_edges_node_flashCards_template | null
}

export interface DeckQuery_deck_notes_edges_node_deck {
  __typename: 'Deck'
  /**
   * Title of the deck
   */
  title: string
}

export interface DeckQuery_deck_notes_edges_node {
  __typename: 'Note'
  /**
   * The ID of an object
   */
  id: string
  /**
   * Note text representation
   */
  text: string | null
  /**
   * Model of this note
   */
  model: DeckQuery_deck_notes_edges_node_model | null
  /**
   * Generated flashcards
   */
  flashCards: DeckQuery_deck_notes_edges_node_flashCards[]
  /**
   * Deck containing this note
   */
  deck: DeckQuery_deck_notes_edges_node_deck | null
}

export interface DeckQuery_deck_notes_edges {
  __typename: 'NoteEdge'
  /**
   * The item at the end of the edge
   */
  node: DeckQuery_deck_notes_edges_node | null
  /**
   * A cursor for use in pagination
   */
  cursor: string
}

export interface DeckQuery_deck_notes_pageInfo {
  __typename: 'PageInfo'
  /**
   * When paginating forwards, are there more items?
   */
  hasNextPage: boolean
  /**
   * When paginating forwards, the cursor to continue.
   */
  endCursor: string | null
}

export interface DeckQuery_deck_notes_pageCursors_first {
  __typename: 'PageCursor'
  cursor: string
  page: number
  isCurrent: boolean
}

export interface DeckQuery_deck_notes_pageCursors_around {
  __typename: 'PageCursor'
  cursor: string
  page: number
  isCurrent: boolean
}

export interface DeckQuery_deck_notes_pageCursors_last {
  __typename: 'PageCursor'
  cursor: string
  page: number
  isCurrent: boolean
}

export interface DeckQuery_deck_notes_pageCursors_previous {
  __typename: 'PageCursor'
  cursor: string
  page: number
  isCurrent: boolean
}

export interface DeckQuery_deck_notes_pageCursors {
  __typename: 'PageCursors'
  /**
   * Optional, may be included in `around` (if current page is near the beginning).
   */
  first: DeckQuery_deck_notes_pageCursors_first | null
  /**
   * Always includes current page
   */
  around: DeckQuery_deck_notes_pageCursors_around[]
  /**
   * Optional, may be included in `around` (if current page is near the end).
   */
  last: DeckQuery_deck_notes_pageCursors_last | null
  previous: DeckQuery_deck_notes_pageCursors_previous | null
}

export interface DeckQuery_deck_notes {
  __typename: 'NoteConnection'
  totalCount: number
  /**
   * A list of edges.
   */
  edges: (DeckQuery_deck_notes_edges | null)[] | null
  /**
   * Information to aid in pagination.
   */
  pageInfo: DeckQuery_deck_notes_pageInfo
  pageCursors: DeckQuery_deck_notes_pageCursors
}

export interface DeckQuery_deck {
  __typename: 'Deck'
  /**
   * The ID of an object
   */
  id: string
  /**
   * Unique identifiable slug
   */
  slug: string
  /**
   * Title of the deck
   */
  title: string
  /**
   * Description of the deck
   */
  description: string | null
  /**
   * Whether this deck is published to the marketplace
   */
  published: boolean
  /**
   * Original deck
   */
  originalDeck: DeckQuery_deck_originalDeck | null
  /**
   * Number of notes in this deck
   */
  totalNotes: number
  /**
   * Number of flashcards in this deck
   */
  totalFlashcards: number
  /**
   * Notes contained in this deck
   */
  notes: DeckQuery_deck_notes | null
}

export interface DeckQuery {
  /**
   * Get single deck by it's slug
   */
  deck: DeckQuery_deck | null
}

export interface DeckQueryVariables {
  slug: string
  page: number
  size: number
  search?: string | null
}
