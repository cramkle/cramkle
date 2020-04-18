/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteNoteMutation
// ====================================================

export interface DeleteNoteMutation_deleteNote {
  __typename: "Note";
  /**
   * Note id
   */
  id: string;
}

export interface DeleteNoteMutation {
  /**
   * Delete a give note
   */
  deleteNote: DeleteNoteMutation_deleteNote | null;
}

export interface DeleteNoteMutationVariables {
  noteId: string;
}
