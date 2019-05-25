/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DeckQuery
// ====================================================

export interface DeckQuery_deck {
  __typename: "Deck";
  /**
   * Deck id
   */
  id: string;
  /**
   * Unique identifiable slug
   */
  slug: string;
  /**
   * Title of the deck
   */
  title: string;
  /**
   * Description of the deck
   */
  description: string | null;
}

export interface DeckQuery {
  /**
   * Get single deck
   */
  deck: DeckQuery_deck | null;
}

export interface DeckQueryVariables {
  slug: string;
}
