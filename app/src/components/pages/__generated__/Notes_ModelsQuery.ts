/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Notes_ModelsQuery
// ====================================================

export interface Notes_ModelsQuery_cardModels_fields {
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

export interface Notes_ModelsQuery_cardModels {
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
   * Fields associated with this model
   */
  fields: (Notes_ModelsQuery_cardModels_fields | null)[] | null;
}

export interface Notes_ModelsQuery {
  /**
   * Retrieve all card models for the logged user
   */
  cardModels: (Notes_ModelsQuery_cardModels | null)[] | null;
}
