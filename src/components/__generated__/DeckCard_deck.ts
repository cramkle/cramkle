/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: DeckCard_deck
// ====================================================

export interface DeckCard_deck_studySessionDetails {
  __typename: "StudySessionDetails";
  newCount: number;
  learningCount: number;
  reviewCount: number;
}

export interface DeckCard_deck {
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
   * Details of current study session
   */
  studySessionDetails: DeckCard_deck_studySessionDetails;
}
