/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: DraftContent
// ====================================================

export interface DraftContent_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string | null;
  offset: number | null;
  length: number | null;
}

export interface DraftContent_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface DraftContent_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: (DraftContent_blocks_inlineStyleRanges | null)[] | null;
  entityRanges: (DraftContent_blocks_entityRanges | null)[] | null;
  data: any | null;
}

export interface DraftContent {
  __typename: "ContentState";
  id: string;
  blocks: DraftContent_blocks[];
  entityMap: any;
}
