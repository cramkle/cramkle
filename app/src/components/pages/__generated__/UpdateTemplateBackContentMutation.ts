/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ContentStateInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateTemplateBackContentMutation
// ====================================================

export interface UpdateTemplateBackContentMutation_updateTemplate_template_backSide_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string;
  offset: number;
  length: number;
}

export interface UpdateTemplateBackContentMutation_updateTemplate_template_backSide_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface UpdateTemplateBackContentMutation_updateTemplate_template_backSide_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: UpdateTemplateBackContentMutation_updateTemplate_template_backSide_blocks_inlineStyleRanges[];
  entityRanges: UpdateTemplateBackContentMutation_updateTemplate_template_backSide_blocks_entityRanges[];
  data: any | null;
}

export interface UpdateTemplateBackContentMutation_updateTemplate_template_backSide {
  __typename: "ContentState";
  /**
   * The ID of an object
   */
  id: string;
  blocks: UpdateTemplateBackContentMutation_updateTemplate_template_backSide_blocks[];
  entityMap: any;
}

export interface UpdateTemplateBackContentMutation_updateTemplate_template {
  __typename: "Template";
  /**
   * The ID of an object
   */
  id: string;
  /**
   * Back side template
   */
  backSide: UpdateTemplateBackContentMutation_updateTemplate_template_backSide | null;
}

export interface UpdateTemplateBackContentMutation_updateTemplate {
  __typename: "UpdateTemplatePayload";
  template: UpdateTemplateBackContentMutation_updateTemplate_template | null;
}

export interface UpdateTemplateBackContentMutation {
  /**
   * Updates an existing template
   */
  updateTemplate: UpdateTemplateBackContentMutation_updateTemplate | null;
}

export interface UpdateTemplateBackContentMutationVariables {
  id: string;
  content?: ContentStateInput | null;
}
