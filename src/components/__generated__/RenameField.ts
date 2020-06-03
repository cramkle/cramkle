/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RenameField
// ====================================================

export interface RenameField_updateField_field {
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

export interface RenameField_updateField {
  __typename: "UpdateFieldPayload";
  field: RenameField_updateField_field | null;
}

export interface RenameField {
  /**
   * Updates an existing field
   */
  updateField: RenameField_updateField | null;
}

export interface RenameFieldVariables {
  fieldName: string;
  fieldId: string;
}
