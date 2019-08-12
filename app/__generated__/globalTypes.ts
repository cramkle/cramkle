/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface BlockInput {
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges?: (InlineStyleRangeInput | null)[] | null;
  entityRanges?: (EntityRangeInput | null)[] | null;
  data?: any | null;
}

export interface ContentStateInput {
  blocks?: (BlockInput | null)[] | null;
  entityMap?: any | null;
}

export interface EntityRangeInput {
  key: number;
  length: number;
  offset: number;
}

export interface FieldInput {
  id?: string | null;
  name: string;
}

export interface FieldValueInput {
  data?: ContentStateInput | null;
  field?: FieldInput | null;
}

export interface InlineStyleRangeInput {
  style?: string | null;
  offset?: number | null;
  length?: number | null;
}

export interface TemplateInput {
  name: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
