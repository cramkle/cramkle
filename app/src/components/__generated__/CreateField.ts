/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateField
// ====================================================

export interface CreateField_addFieldToModel_field {
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

export interface CreateField_addFieldToModel {
  __typename: "AddFieldToModelPayload";
  field: CreateField_addFieldToModel_field | null;
}

export interface CreateField {
  /**
   * Adds a new fields to a model
   */
  addFieldToModel: CreateField_addFieldToModel | null;
}

export interface CreateFieldVariables {
  fieldName: string;
  modelId: string;
}
