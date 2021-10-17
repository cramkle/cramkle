/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateDeckMutation
// ====================================================

export interface UpdateDeckMutation_updateDeck_deck {
  __typename: "Deck";
  /**
   * The ID of an object
   */
  id: string;
  /**
   * Title of the deck
   */
  title: string;
  /**
   * Description of the deck
   */
  description: string | null;
}

export interface UpdateDeckMutation_updateDeck {
  __typename: "UpdateDeckPayload";
  /**
   * Updated deck
   */
  deck: UpdateDeckMutation_updateDeck_deck | null;
}

export interface UpdateDeckMutation {
  /**
   * Update a deck
   */
  updateDeck: UpdateDeckMutation_updateDeck | null;
}

export interface UpdateDeckMutationVariables {
  id: string;
  title: string;
  description?: string | null;
}
