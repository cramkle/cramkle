/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FlashCardStatus } from './../../../globalTypes'

// ====================================================
// GraphQL query operation: DeckQuery
// ====================================================

export interface DeckQuery_deck_notes_edges_node_model_primaryField {
  __typename: 'Field'
  /**
   * Field id
   */
  id: string
}

export interface DeckQuery_deck_notes_edges_node_model {
  __typename: 'Model'
  /**
   * Name of this card model (e.g. "Basic", "Basic with Reversed")
   */
  name: string | null
  /**
   * Primary field that should represent each individual note
   * of this model.
   */
  primaryField: DeckQuery_deck_notes_edges_node_model_primaryField | null
}

export interface DeckQuery_deck_notes_edges_node_flashCards_template {
  __typename: 'Template'
  /**
   * Name of the template
   */
  name: string | null
}

export interface DeckQuery_deck_notes_edges_node_flashCards {
  __typename: 'FlashCard'
  /**
   * FlashCard id.
   */
  id: string
  /**
   * Whether to be filtered of not.
   *
   * Acts like a logical deletion it when comes to the review.
   */
  active: boolean | null
  /**
   * Deprecated
   */
  state: FlashCardStatus | null
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
   * Note id
   */
  id: string
  /**
   * Note text representation
   */
  text: string
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
  node: DeckQuery_deck_notes_edges_node
  cursor: string
}

export interface DeckQuery_deck_notes_pageInfo {
  __typename: 'PageInfo'
  hasNextPage: boolean
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
  first: DeckQuery_deck_notes_pageCursors_first | null
  around: DeckQuery_deck_notes_pageCursors_around[]
  last: DeckQuery_deck_notes_pageCursors_last | null
  previous: DeckQuery_deck_notes_pageCursors_previous | null
}

export interface DeckQuery_deck_notes {
  __typename: 'NoteConnection'
  totalCount: number
  edges: DeckQuery_deck_notes_edges[]
  pageInfo: DeckQuery_deck_notes_pageInfo
  pageCursors: DeckQuery_deck_notes_pageCursors
}

export interface DeckQuery_deck {
  __typename: 'Deck'
  /**
   * Deck id
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
   * Number of notes in this deck
   */
  totalNotes: number
  /**
   * Number of flashCards in this deck
   */
  totalFlashcards: number
  /**
   * Notes contained in this deck
   */
  notes: DeckQuery_deck_notes | null
}

export interface DeckQuery {
  /**
   * Get single deck
   */
  deck: DeckQuery_deck | null
}

export interface DeckQueryVariables {
  slug: string
  page: number
  size: number
  search?: string | null
}
