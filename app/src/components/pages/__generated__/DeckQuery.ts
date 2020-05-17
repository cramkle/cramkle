/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FlashCardStatus } from './../../../globalTypes'

// ====================================================
// GraphQL query operation: DeckQuery
// ====================================================

export interface DeckQuery_deck_notes_edges_node_values_data_blocks_inlineStyleRanges {
  __typename: 'InlineStyleRange'
  style: string | null
  offset: number | null
  length: number | null
}

export interface DeckQuery_deck_notes_edges_node_values_data_blocks_entityRanges {
  __typename: 'EntityRange'
  key: number
  length: number
  offset: number
}

export interface DeckQuery_deck_notes_edges_node_values_data_blocks {
  __typename: 'Block'
  key: string
  type: string
  text: string
  depth: number
  inlineStyleRanges:
    | (DeckQuery_deck_notes_edges_node_values_data_blocks_inlineStyleRanges | null)[]
    | null
  entityRanges:
    | (DeckQuery_deck_notes_edges_node_values_data_blocks_entityRanges | null)[]
    | null
  data: any | null
}

export interface DeckQuery_deck_notes_edges_node_values_data {
  __typename: 'ContentState'
  id: string
  blocks: DeckQuery_deck_notes_edges_node_values_data_blocks[]
  entityMap: any
}

export interface DeckQuery_deck_notes_edges_node_values_field {
  __typename: 'Field'
  /**
   * Field id
   */
  id: string
  /**
   * Name of the field
   */
  name: string
}

export interface DeckQuery_deck_notes_edges_node_values {
  __typename: 'FieldValue'
  /**
   * Field value id
   */
  id: string
  /**
   * Field data
   */
  data: DeckQuery_deck_notes_edges_node_values_data | null
  /**
   * Associated field
   */
  field: DeckQuery_deck_notes_edges_node_values_field | null
}

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
   * Values of this note
   */
  values: DeckQuery_deck_notes_edges_node_values[]
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
  hasPreviousPage: boolean
  endCursor: string | null
  startCursor: string | null
}

export interface DeckQuery_deck_notes {
  __typename: 'NoteConnection'
  edges: DeckQuery_deck_notes_edges[]
  pageInfo: DeckQuery_deck_notes_pageInfo
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
  after?: string | null
  first?: number | null
  before?: string | null
  last?: number | null
}
