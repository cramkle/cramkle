/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteDeckMutation
// ====================================================

export interface DeleteDeckMutation_deleteDeck_deck {
  __typename: "Deck";
  /**
   * The ID of an object
   */
  id: string;
}

export interface DeleteDeckMutation_deleteDeck {
  __typename: "DeleteDeckPayload";
  /**
   * Deleted deck
   */
  deck: DeleteDeckMutation_deleteDeck_deck | null;
}

export interface DeleteDeckMutation {
  /**
   * Delete a deck
   */
  deleteDeck: DeleteDeckMutation_deleteDeck | null;
}

export interface DeleteDeckMutationVariables {
  deckId: string;
}
