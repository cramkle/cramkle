/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ContentStateInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateFieldValue
// ====================================================

export interface UpdateFieldValue_updateFieldValue_fieldValue_data_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string;
  offset: number;
  length: number;
}

export interface UpdateFieldValue_updateFieldValue_fieldValue_data_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface UpdateFieldValue_updateFieldValue_fieldValue_data_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: UpdateFieldValue_updateFieldValue_fieldValue_data_blocks_inlineStyleRanges[];
  entityRanges: UpdateFieldValue_updateFieldValue_fieldValue_data_blocks_entityRanges[];
  data: any | null;
}

export interface UpdateFieldValue_updateFieldValue_fieldValue_data {
  __typename: "ContentState";
  /**
   * The ID of an object
   */
  id: string;
  blocks: UpdateFieldValue_updateFieldValue_fieldValue_data_blocks[];
  entityMap: any;
}

export interface UpdateFieldValue_updateFieldValue_fieldValue {
  __typename: "FieldValue";
  /**
   * The ID of an object
   */
  id: string;
  /**
   * Field data
   */
  data: UpdateFieldValue_updateFieldValue_fieldValue_data | null;
}

export interface UpdateFieldValue_updateFieldValue {
  __typename: "UpdateFieldValuePayload";
  fieldValue: UpdateFieldValue_updateFieldValue_fieldValue | null;
}

export interface UpdateFieldValue {
  /**
   * Updates the field value of a note
   */
  updateFieldValue: UpdateFieldValue_updateFieldValue | null;
}

export interface UpdateFieldValueVariables {
  noteId: string;
  fieldId: string;
  data: ContentStateInput;
}
