/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DecksQuery
// ====================================================

export interface DecksQuery_decks {
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
}

export interface DecksQuery {
  /**
   * Retrieve all decks for the logged user
   */
  decks: DecksQuery_decks[]
}
