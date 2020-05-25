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
