/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ContentStateInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateTemplateFrontContentMutation
// ====================================================

export interface UpdateTemplateFrontContentMutation_updateTemplate_frontSide_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string | null;
  offset: number | null;
  length: number | null;
}

export interface UpdateTemplateFrontContentMutation_updateTemplate_frontSide_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface UpdateTemplateFrontContentMutation_updateTemplate_frontSide_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: (UpdateTemplateFrontContentMutation_updateTemplate_frontSide_blocks_inlineStyleRanges | null)[] | null;
  entityRanges: (UpdateTemplateFrontContentMutation_updateTemplate_frontSide_blocks_entityRanges | null)[] | null;
  data: any | null;
}

export interface UpdateTemplateFrontContentMutation_updateTemplate_frontSide {
  __typename: "ContentState";
  id: string;
  blocks: UpdateTemplateFrontContentMutation_updateTemplate_frontSide_blocks[];
  entityMap: any;
}

export interface UpdateTemplateFrontContentMutation_updateTemplate {
  __typename: "Template";
  /**
   * Template id
   */
  id: string;
  /**
   * Front side template
   */
  frontSide: UpdateTemplateFrontContentMutation_updateTemplate_frontSide | null;
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
