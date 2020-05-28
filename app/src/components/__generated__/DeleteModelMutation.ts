/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteModelMutation
// ====================================================

export interface DeleteModelMutation_deleteModel_model {
  __typename: "Model";
  /**
   * The ID of an object
   */
  id: string;
}

export interface DeleteModelMutation_deleteModel {
  __typename: "DeleteModelPayload";
  model: DeleteModelMutation_deleteModel_model | null;
}

export interface DeleteModelMutation {
  /**
   * Deletes a model and all associated entities (such as flashcards and templates).
   */
  deleteModel: DeleteModelMutation_deleteModel | null;
}

export interface DeleteModelMutationVariables {
  modelId: string;
}
