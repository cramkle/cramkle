/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateTemplate
// ====================================================

export interface CreateTemplate_addTemplateToModel_template_frontSide_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string;
  offset: number;
  length: number;
}

export interface CreateTemplate_addTemplateToModel_template_frontSide_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface CreateTemplate_addTemplateToModel_template_frontSide_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: CreateTemplate_addTemplateToModel_template_frontSide_blocks_inlineStyleRanges[];
  entityRanges: CreateTemplate_addTemplateToModel_template_frontSide_blocks_entityRanges[];
  data: any | null;
}

export interface CreateTemplate_addTemplateToModel_template_frontSide {
  __typename: "ContentState";
  /**
   * The ID of an object
   */
  id: string;
  blocks: CreateTemplate_addTemplateToModel_template_frontSide_blocks[];
  entityMap: any;
}

export interface CreateTemplate_addTemplateToModel_template_backSide_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string;
  offset: number;
  length: number;
}

export interface CreateTemplate_addTemplateToModel_template_backSide_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface CreateTemplate_addTemplateToModel_template_backSide_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: CreateTemplate_addTemplateToModel_template_backSide_blocks_inlineStyleRanges[];
  entityRanges: CreateTemplate_addTemplateToModel_template_backSide_blocks_entityRanges[];
  data: any | null;
}

export interface CreateTemplate_addTemplateToModel_template_backSide {
  __typename: "ContentState";
  /**
   * The ID of an object
   */
  id: string;
  blocks: CreateTemplate_addTemplateToModel_template_backSide_blocks[];
  entityMap: any;
}

export interface CreateTemplate_addTemplateToModel_template {
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
  frontSide: CreateTemplate_addTemplateToModel_template_frontSide | null;
  /**
   * Back side template
   */
  backSide: CreateTemplate_addTemplateToModel_template_backSide | null;
}

export interface CreateTemplate_addTemplateToModel {
  __typename: "AddTemplateToModelPayload";
  template: CreateTemplate_addTemplateToModel_template | null;
}

export interface CreateTemplate {
  /**
   * Adds a new template to a model
   */
  addTemplateToModel: CreateTemplate_addTemplateToModel | null;
}

export interface CreateTemplateVariables {
  modelId: string;
  templateName: string;
}
