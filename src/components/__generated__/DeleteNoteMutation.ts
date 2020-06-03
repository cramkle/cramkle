/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteNoteMutation
// ====================================================

export interface DeleteNoteMutation_deleteNote_note {
  __typename: "Note";
  /**
   * The ID of an object
   */
  id: string;
}

export interface DeleteNoteMutation_deleteNote {
  __typename: "DeleteNotePayload";
  note: DeleteNoteMutation_deleteNote_note | null;
}

export interface DeleteNoteMutation {
  /**
   * Deletes a given note
   */
  deleteNote: DeleteNoteMutation_deleteNote | null;
}

export interface DeleteNoteMutationVariables {
  noteId: string;
}
