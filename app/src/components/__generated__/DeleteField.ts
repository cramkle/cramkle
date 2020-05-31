/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteField
// ====================================================

export interface DeleteField_removeFieldFromModel_field {
  __typename: "Field";
  /**
   * The ID of an object
   */
  id: string;
  /**
   * Name of the field
   */
  name: string;
}

export interface DeleteField_removeFieldFromModel {
  __typename: "RemoveFieldFromModelPayload";
  field: DeleteField_removeFieldFromModel_field | null;
}

export interface DeleteField {
  /**
   * Removes the field from it's model
   */
  removeFieldFromModel: DeleteField_removeFieldFromModel | null;
}

export interface DeleteFieldVariables {
  fieldId: string;
}
