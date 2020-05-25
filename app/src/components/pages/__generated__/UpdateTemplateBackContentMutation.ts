/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ContentStateInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateTemplateBackContentMutation
// ====================================================

export interface UpdateTemplateBackContentMutation_updateTemplate_backSide_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string | null;
  offset: number | null;
  length: number | null;
}

export interface UpdateTemplateBackContentMutation_updateTemplate_backSide_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface UpdateTemplateBackContentMutation_updateTemplate_backSide_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: (UpdateTemplateBackContentMutation_updateTemplate_backSide_blocks_inlineStyleRanges | null)[] | null;
  entityRanges: (UpdateTemplateBackContentMutation_updateTemplate_backSide_blocks_entityRanges | null)[] | null;
  data: any | null;
}

export interface UpdateTemplateBackContentMutation_updateTemplate_backSide {
  __typename: "ContentState";
  id: string;
  blocks: UpdateTemplateBackContentMutation_updateTemplate_backSide_blocks[];
  entityMap: any;
}

export interface UpdateTemplateBackContentMutation_updateTemplate {
  __typename: "Template";
  /**
   * Template id
   */
  id: string;
  /**
   * Back side template
   */
  backSide: UpdateTemplateBackContentMutation_updateTemplate_backSide | null;
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
