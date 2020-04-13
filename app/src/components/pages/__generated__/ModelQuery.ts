/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ModelQuery
// ====================================================

export interface ModelQuery_cardModel_fields {
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

export interface ModelQuery_cardModel_templates_frontSide_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string | null;
  offset: number | null;
  length: number | null;
}

export interface ModelQuery_cardModel_templates_frontSide_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface ModelQuery_cardModel_templates_frontSide_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: (ModelQuery_cardModel_templates_frontSide_blocks_inlineStyleRanges | null)[] | null;
  entityRanges: (ModelQuery_cardModel_templates_frontSide_blocks_entityRanges | null)[] | null;
  data: any | null;
}

export interface ModelQuery_cardModel_templates_frontSide {
  __typename: "ContentState";
  id: string;
  blocks: (ModelQuery_cardModel_templates_frontSide_blocks | null)[] | null;
  entityMap: any | null;
}

export interface ModelQuery_cardModel_templates_backSide_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string | null;
  offset: number | null;
  length: number | null;
}

export interface ModelQuery_cardModel_templates_backSide_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface ModelQuery_cardModel_templates_backSide_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: (ModelQuery_cardModel_templates_backSide_blocks_inlineStyleRanges | null)[] | null;
  entityRanges: (ModelQuery_cardModel_templates_backSide_blocks_entityRanges | null)[] | null;
  data: any | null;
}

export interface ModelQuery_cardModel_templates_backSide {
  __typename: "ContentState";
  id: string;
  blocks: (ModelQuery_cardModel_templates_backSide_blocks | null)[] | null;
  entityMap: any | null;
}

export interface ModelQuery_cardModel_templates {
  __typename: "Template";
  /**
   * Template id
   */
  id: string;
  /**
   * Name of the template
   */
  name: string | null;
  /**
   * Front side template
   */
  frontSide: ModelQuery_cardModel_templates_frontSide | null;
  /**
   * Back side template
   */
  backSide: ModelQuery_cardModel_templates_backSide | null;
}

export interface ModelQuery_cardModel_notes {
  __typename: "Note";
  /**
   * Note id
   */
  id: string;
}

export interface ModelQuery_cardModel {
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
  fields: ModelQuery_cardModel_fields[];
  /**
   * Templates associated with this model
   */
  templates: ModelQuery_cardModel_templates[];
  /**
   * Notes associated with this model
   */
  notes: ModelQuery_cardModel_notes[] | null;
}

export interface ModelQuery {
  /**
   * Get single card model
   */
  cardModel: ModelQuery_cardModel | null;
}

export interface ModelQueryVariables {
  id: string;
}
