/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UnpublishDeckMutation
// ====================================================

export interface UnpublishDeckMutation_unpublishDeck_deck {
  __typename: "Deck";
  /**
   * The ID of an object
   */
  id: string;
}

export interface UnpublishDeckMutation_unpublishDeck {
  __typename: "UnpublishDeckPayload";
  deck: UnpublishDeckMutation_unpublishDeck_deck | null;
}

export interface UnpublishDeckMutation {
  /**
   * Unpublish a deck from the marketplace
   */
  unpublishDeck: UnpublishDeckMutation_unpublishDeck | null;
}

export interface UnpublishDeckMutationVariables {
  id: string;
}
