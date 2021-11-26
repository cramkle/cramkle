/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PublishedDecksQuery
// ====================================================

export interface PublishedDecksQuery_publishedDecks_owner {
  __typename: "User";
  /**
   * User's username
   */
  username: string;
}

export interface PublishedDecksQuery_publishedDecks {
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
  /**
   * Owner of the deck
   */
  owner: PublishedDecksQuery_publishedDecks_owner | null;
}

export interface PublishedDecksQuery {
  /**
   * Retrieve all published decks
   */
  publishedDecks: PublishedDecksQuery_publishedDecks[];
}
