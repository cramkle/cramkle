/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PublishDeckMutation
// ====================================================

export interface PublishDeckMutation_publishDeck_deck {
  __typename: "Deck";
  /**
   * The ID of an object
   */
  id: string;
}

export interface PublishDeckMutation_publishDeck {
  __typename: "PublishDeckPayload";
  deck: PublishDeckMutation_publishDeck_deck | null;
}

export interface PublishDeckMutation {
  /**
   * Publish a deck to the marketplace
   */
  publishDeck: PublishDeckMutation_publishDeck | null;
}

export interface PublishDeckMutationVariables {
  id: string;
}
