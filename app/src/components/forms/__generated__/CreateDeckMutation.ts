/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateDeckMutation
// ====================================================

export interface CreateDeckMutation_createDeck_deck_studySessionDetails {
  __typename: "StudySessionDetails";
  newCount: number;
  learningCount: number;
  reviewCount: number;
}

export interface CreateDeckMutation_createDeck_deck {
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
  studySessionDetails: CreateDeckMutation_createDeck_deck_studySessionDetails;
}

export interface CreateDeckMutation_createDeck {
  __typename: "CreateDeckPayload";
  /**
   * Created deck
   */
  deck: CreateDeckMutation_createDeck_deck | null;
}

export interface CreateDeckMutation {
  /**
   * Create a deck entity
   */
  createDeck: CreateDeckMutation_createDeck | null;
}

export interface CreateDeckMutationVariables {
  title: string;
  description?: string | null;
}
