/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ImportDeckMutation
// ====================================================

export interface ImportDeckMutation_importDeck_deck {
  __typename: "Deck";
  /**
   * The ID of an object
   */
  id: string;
  /**
   * Unique identifiable slug
   */
  slug: string;
}

export interface ImportDeckMutation_importDeck {
  __typename: "ImportDeckPayload";
  /**
   * Created deck
   */
  deck: ImportDeckMutation_importDeck_deck | null;
}

export interface ImportDeckMutation {
  /**
   * Import/Duplicate a deck entity
   */
  importDeck: ImportDeckMutation_importDeck | null;
}

export interface ImportDeckMutationVariables {
  id: string;
}
