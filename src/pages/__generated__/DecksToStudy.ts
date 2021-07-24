/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DecksToStudy
// ====================================================

export interface DecksToStudy_decks_studySessionDetails {
  __typename: "StudySessionDetails";
  newCount: number;
  learningCount: number;
  reviewCount: number;
}

export interface DecksToStudy_decks {
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
  studySessionDetails: DecksToStudy_decks_studySessionDetails;
}

export interface DecksToStudy {
  /**
   * Retrieve all decks for the logged user
   */
  decks: DecksToStudy_decks[];
}
