/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RenameTemplate
// ====================================================

export interface RenameTemplate_updateTemplate_template_frontSide_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string;
  offset: number;
  length: number;
}

export interface RenameTemplate_updateTemplate_template_frontSide_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface RenameTemplate_updateTemplate_template_frontSide_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: RenameTemplate_updateTemplate_template_frontSide_blocks_inlineStyleRanges[];
  entityRanges: RenameTemplate_updateTemplate_template_frontSide_blocks_entityRanges[];
  data: any | null;
}

export interface RenameTemplate_updateTemplate_template_frontSide {
  __typename: "ContentState";
  /**
   * The ID of an object
   */
  id: string;
  blocks: RenameTemplate_updateTemplate_template_frontSide_blocks[];
  entityMap: any;
}

export interface RenameTemplate_updateTemplate_template_backSide_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string;
  offset: number;
  length: number;
}

export interface RenameTemplate_updateTemplate_template_backSide_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface RenameTemplate_updateTemplate_template_backSide_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: RenameTemplate_updateTemplate_template_backSide_blocks_inlineStyleRanges[];
  entityRanges: RenameTemplate_updateTemplate_template_backSide_blocks_entityRanges[];
  data: any | null;
}

export interface RenameTemplate_updateTemplate_template_backSide {
  __typename: "ContentState";
  /**
   * The ID of an object
   */
  id: string;
  blocks: RenameTemplate_updateTemplate_template_backSide_blocks[];
  entityMap: any;
}

export interface RenameTemplate_updateTemplate_template {
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
  frontSide: RenameTemplate_updateTemplate_template_frontSide | null;
  /**
   * Back side template
   */
  backSide: RenameTemplate_updateTemplate_template_backSide | null;
}

export interface RenameTemplate_updateTemplate {
  __typename: "UpdateTemplatePayload";
  template: RenameTemplate_updateTemplate_template | null;
}

export interface RenameTemplate {
  /**
   * Updates an existing template
   */
  updateTemplate: RenameTemplate_updateTemplate | null;
}

export interface RenameTemplateVariables {
  templateId: string;
  templateName: string;
}
