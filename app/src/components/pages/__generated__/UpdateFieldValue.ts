/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ContentStateInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateFieldValue
// ====================================================

export interface UpdateFieldValue_updateFieldValue_data_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string | null;
  offset: number | null;
  length: number | null;
}

export interface UpdateFieldValue_updateFieldValue_data_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface UpdateFieldValue_updateFieldValue_data_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: (UpdateFieldValue_updateFieldValue_data_blocks_inlineStyleRanges | null)[] | null;
  entityRanges: (UpdateFieldValue_updateFieldValue_data_blocks_entityRanges | null)[] | null;
  data: any | null;
}

export interface UpdateFieldValue_updateFieldValue_data {
  __typename: "ContentState";
  id: string;
  blocks: UpdateFieldValue_updateFieldValue_data_blocks[];
  entityMap: any;
}

export interface UpdateFieldValue_updateFieldValue {
  __typename: "FieldValue";
  /**
   * Field value id
   */
  id: string;
  /**
   * Field data
   */
  data: UpdateFieldValue_updateFieldValue_data | null;
}

export interface UpdateFieldValue {
  /**
   * Update the field value of a note
   */
  updateFieldValue: UpdateFieldValue_updateFieldValue | null;
}

export interface UpdateFieldValueVariables {
  noteId: string;
  fieldId: string;
  data: ContentStateInput;
}
