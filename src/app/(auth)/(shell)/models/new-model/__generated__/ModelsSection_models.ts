/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ModelsSection_models
// ====================================================

export interface ModelsSection_models_templates {
  __typename: "Template";
  /**
   * The ID of an object
   */
  id: string;
  /**
   * Name of the template
   */
  name: string;
}

export interface ModelsSection_models_fields {
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

export interface ModelsSection_models {
  __typename: "Model";
  /**
   * The ID of an object
   */
  id: string;
  /**
   * Name of this card model (e.g. "Basic", "Basic with Reversed")
   */
  name: string;
  /**
   * Templates associated with this model
   */
  templates: ModelsSection_models_templates[];
  /**
   * Fields associated with this model
   */
  fields: ModelsSection_models_fields[];
}
