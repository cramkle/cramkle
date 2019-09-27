/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteDeckMutation
// ====================================================

export interface DeleteDeckMutation_deleteDeck {
  __typename: "Deck";
  /**
   * Deck id
   */
  id: string;
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
