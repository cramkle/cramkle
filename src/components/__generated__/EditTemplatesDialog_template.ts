/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: EditTemplatesDialog_template
// ====================================================

export interface EditTemplatesDialog_template_frontSide_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string;
  offset: number;
  length: number;
}

export interface EditTemplatesDialog_template_frontSide_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface EditTemplatesDialog_template_frontSide_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: EditTemplatesDialog_template_frontSide_blocks_inlineStyleRanges[];
  entityRanges: EditTemplatesDialog_template_frontSide_blocks_entityRanges[];
  data: any | null;
}

export interface EditTemplatesDialog_template_frontSide {
  __typename: "ContentState";
  /**
   * The ID of an object
   */
  id: string;
  blocks: EditTemplatesDialog_template_frontSide_blocks[];
  entityMap: any;
}

export interface EditTemplatesDialog_template_backSide_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string;
  offset: number;
  length: number;
}

export interface EditTemplatesDialog_template_backSide_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface EditTemplatesDialog_template_backSide_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: EditTemplatesDialog_template_backSide_blocks_inlineStyleRanges[];
  entityRanges: EditTemplatesDialog_template_backSide_blocks_entityRanges[];
  data: any | null;
}

export interface EditTemplatesDialog_template_backSide {
  __typename: "ContentState";
  /**
   * The ID of an object
   */
  id: string;
  blocks: EditTemplatesDialog_template_backSide_blocks[];
  entityMap: any;
}

export interface EditTemplatesDialog_template {
  __typename: "Template";
  /**
   * The ID of an object
   */
  id: string;
  /**
   * Name of the template
   */
  name: string;
  /**
   * Front side template
   */
  frontSide: EditTemplatesDialog_template_frontSide | null;
  /**
   * Back side template
   */
  backSide: EditTemplatesDialog_template_backSide | null;
}
