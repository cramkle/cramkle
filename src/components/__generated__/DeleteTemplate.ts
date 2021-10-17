/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteTemplate
// ====================================================

export interface DeleteTemplate_removeTemplateFromModel_template_frontSide_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string;
  offset: number;
  length: number;
}

export interface DeleteTemplate_removeTemplateFromModel_template_frontSide_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface DeleteTemplate_removeTemplateFromModel_template_frontSide_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: DeleteTemplate_removeTemplateFromModel_template_frontSide_blocks_inlineStyleRanges[];
  entityRanges: DeleteTemplate_removeTemplateFromModel_template_frontSide_blocks_entityRanges[];
  data: any | null;
}

export interface DeleteTemplate_removeTemplateFromModel_template_frontSide {
  __typename: "ContentState";
  /**
   * The ID of an object
   */
  id: string;
  blocks: DeleteTemplate_removeTemplateFromModel_template_frontSide_blocks[];
  entityMap: any;
}

export interface DeleteTemplate_removeTemplateFromModel_template_backSide_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string;
  offset: number;
  length: number;
}

export interface DeleteTemplate_removeTemplateFromModel_template_backSide_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface DeleteTemplate_removeTemplateFromModel_template_backSide_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: DeleteTemplate_removeTemplateFromModel_template_backSide_blocks_inlineStyleRanges[];
  entityRanges: DeleteTemplate_removeTemplateFromModel_template_backSide_blocks_entityRanges[];
  data: any | null;
}

export interface DeleteTemplate_removeTemplateFromModel_template_backSide {
  __typename: "ContentState";
  /**
   * The ID of an object
   */
  id: string;
  blocks: DeleteTemplate_removeTemplateFromModel_template_backSide_blocks[];
  entityMap: any;
}

export interface DeleteTemplate_removeTemplateFromModel_template {
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
  frontSide: DeleteTemplate_removeTemplateFromModel_template_frontSide | null;
  /**
   * Back side template
   */
  backSide: DeleteTemplate_removeTemplateFromModel_template_backSide | null;
}

export interface DeleteTemplate_removeTemplateFromModel {
  __typename: "RemoveTemplateFromModelPayload";
  template: DeleteTemplate_removeTemplateFromModel_template | null;
}

export interface DeleteTemplate {
  /**
   * Removes a template from it's model and delete associated flashcards
   */
  removeTemplateFromModel: DeleteTemplate_removeTemplateFromModel | null;
}

export interface DeleteTemplateVariables {
  templateId: string;
}
