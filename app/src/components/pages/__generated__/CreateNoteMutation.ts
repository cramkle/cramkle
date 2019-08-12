/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { FieldValueInput } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: CreateNoteMutation
// ====================================================

export interface CreateNoteMutation_createNote {
  __typename: "Note";
  /**
   * Note id
   */
  id: string;
}

export interface CreateNoteMutation {
  /**
   * Create new note in deck
   */
  createNote: CreateNoteMutation_createNote | null;
}

export interface CreateNoteMutationVariables {
  deckId: string;
  modelId: string;
  values: (FieldValueInput | null)[];
}
