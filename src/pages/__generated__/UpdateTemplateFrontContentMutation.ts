/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ContentStateInput } from "./../../globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateTemplateFrontContentMutation
// ====================================================

export interface UpdateTemplateFrontContentMutation_updateTemplate_template_frontSide_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string;
  offset: number;
  length: number;
}

export interface UpdateTemplateFrontContentMutation_updateTemplate_template_frontSide_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface UpdateTemplateFrontContentMutation_updateTemplate_template_frontSide_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: UpdateTemplateFrontContentMutation_updateTemplate_template_frontSide_blocks_inlineStyleRanges[];
  entityRanges: UpdateTemplateFrontContentMutation_updateTemplate_template_frontSide_blocks_entityRanges[];
  data: any | null;
}

export interface UpdateTemplateFrontContentMutation_updateTemplate_template_frontSide {
  __typename: "ContentState";
  /**
   * The ID of an object
   */
  id: string;
  blocks: UpdateTemplateFrontContentMutation_updateTemplate_template_frontSide_blocks[];
  entityMap: any;
}

export interface UpdateTemplateFrontContentMutation_updateTemplate_template {
  __typename: "Template";
  /**
   * The ID of an object
   */
  id: string;
  /**
   * Front side template
   */
  frontSide: UpdateTemplateFrontContentMutation_updateTemplate_template_frontSide | null;
}

export interface UpdateTemplateFrontContentMutation_updateTemplate {
  __typename: "UpdateTemplatePayload";
  template: UpdateTemplateFrontContentMutation_updateTemplate_template | null;
}

export interface UpdateTemplateFrontContentMutation {
  /**
   * Updates an existing template
   */
  updateTemplate: UpdateTemplateFrontContentMutation_updateTemplate | null;
}

export interface UpdateTemplateFrontContentMutationVariables {
  id: string;
  content?: ContentStateInput | null;
}
