/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FieldValueInput } from "./../../../../../../../globalTypes";

// ====================================================
// GraphQL mutation operation: CreateNoteMutation
// ====================================================

export interface CreateNoteMutation_createNote_note {
  __typename: "Note";
  /**
   * The ID of an object
   */
  id: string;
}

export interface CreateNoteMutation_createNote {
  __typename: "CreateNotePayload";
  note: CreateNoteMutation_createNote_note | null;
}

export interface CreateNoteMutation {
  /**
   * Creates a new note in a deck
   */
  createNote: CreateNoteMutation_createNote | null;
}

export interface CreateNoteMutationVariables {
  deckId: string;
  modelId: string;
  values: FieldValueInput[];
}
