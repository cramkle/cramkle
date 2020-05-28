/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DecksQuery
// ====================================================

export interface DecksQuery_decks_studySessionDetails {
  __typename: "StudySessionDetails";
  newCount: number;
  learningCount: number;
  reviewCount: number;
}

export interface DecksQuery_decks {
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
   * Details of current study session
   */
  studySessionDetails: DecksQuery_decks_studySessionDetails;
}

export interface DecksQuery {
  /**
   * Retrieve all decks for the logged user
   */
  decks: DecksQuery_decks[];
}
