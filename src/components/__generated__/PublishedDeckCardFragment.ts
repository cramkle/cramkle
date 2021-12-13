/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PublishedDeckCardFragment
// ====================================================

export interface PublishedDeckCardFragment {
  __typename: "Deck";
  /**
   * The ID of an object
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
  /**
   * Number of notes in this deck
   */
  totalNotes: number;
  /**
   * Number of flashcards in this deck
   */
  totalFlashcards: number;
  /**
   * Whether this deck is published to the marketplace
   */
  published: boolean;
}
