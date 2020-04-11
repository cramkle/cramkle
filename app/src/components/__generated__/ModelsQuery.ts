/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ModelsQuery
// ====================================================

export interface ModelsQuery_cardModels_templates {
  __typename: "Template";
  /**
   * Template id
   */
  id: string;
  /**
   * Name of the template
   */
  name: string | null;
}

export interface ModelsQuery_cardModels_fields {
  __typename: "Field";
  /**
   * Field id
   */
  id: string;
  /**
   * Name of the field
   */
  name: string;
}

export interface ModelsQuery_cardModels {
  __typename: "CardModel";
  /**
   * Card model id
   */
  id: string;
  /**
   * Name of this card model (e.g. "Basic", "Basic with Reversed")
   */
  name: string | null;
  /**
   * Templates associated with this model
   */
  templates: (ModelsQuery_cardModels_templates | null)[] | null;
  /**
   * Fields associated with this model
   */
  fields: (ModelsQuery_cardModels_fields | null)[] | null;
}

export interface ModelsQuery {
  /**
   * Retrieve all card models for the logged user
   */
  cardModels: ModelsQuery_cardModels[] | null;
}
