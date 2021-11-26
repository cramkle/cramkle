/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateDeckPublication
// ====================================================

export interface UpdateDeckPublication_publishDeck_deck {
  __typename: "Deck";
  /**
   * The ID of an object
   */
  id: string;
}

export interface UpdateDeckPublication_publishDeck {
  __typename: "PublishDeckPayload";
  deck: UpdateDeckPublication_publishDeck_deck | null;
}

export interface UpdateDeckPublication {
  /**
   * Publish a deck to the marketplace
   */
  publishDeck: UpdateDeckPublication_publishDeck | null;
}

export interface UpdateDeckPublicationVariables {
  id: string;
}
