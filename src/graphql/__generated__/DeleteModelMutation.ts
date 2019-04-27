/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteModelMutation
// ====================================================

export interface DeleteModelMutation_deleteModel {
  __typename: "CardModel";
  /**
   *  Card model id 
   */
  id: string;
}

export interface DeleteModelMutation {
  /**
   *  Deletes a card model and all associated entities 
   */
  deleteModel: DeleteModelMutation_deleteModel | null;
}

export interface DeleteModelMutationVariables {
  modelId: string;
}
