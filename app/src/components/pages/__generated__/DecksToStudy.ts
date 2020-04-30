/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DecksToStudy
// ====================================================

export interface DecksToStudy_decks {
  __typename: 'Deck'
  /**
   * Deck id
   */
  id: string
  /**
   * Title of the deck
   */
  title: string
  /**
   * Unique identifiable slug
   */
  slug: string
  /**
   * Description of the deck
   */
  description: string | null
}

export interface DecksToStudy {
  /**
   * Retrieve all decks for the logged user
   */
  decks: DecksToStudy_decks[]
}
