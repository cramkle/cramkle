/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateModelMutation
// ====================================================

export interface UpdateModelMutation_updateModel_model {
  __typename: "Model";
  /**
   * The ID of an object
   */
  id: string;
  /**
   * Name of this card model (e.g. "Basic", "Basic with Reversed")
   */
  name: string;
}

export interface UpdateModelMutation_updateModel {
  __typename: "UpdateModelPayload";
  model: UpdateModelMutation_updateModel_model | null;
}

export interface UpdateModelMutation {
  /**
   * Update a model name
   */
  updateModel: UpdateModelMutation_updateModel | null;
}

export interface UpdateModelMutationVariables {
  id: string;
  name: string;
}
