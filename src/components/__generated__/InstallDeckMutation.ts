/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: InstallDeckMutation
// ====================================================

export interface InstallDeckMutation_installDeck_deck {
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
   * Whether this deck is already installed for current user
   */
  isDeckInstalled: boolean;
}

export interface InstallDeckMutation_installDeck {
  __typename: "InstallDeckPayload";
  /**
   * Imported deck
   */
  deck: InstallDeckMutation_installDeck_deck | null;
}

export interface InstallDeckMutation {
  /**
   * Install/Duplicate a deck entity
   */
  installDeck: InstallDeckMutation_installDeck | null;
}

export interface InstallDeckMutationVariables {
  id: string;
}
