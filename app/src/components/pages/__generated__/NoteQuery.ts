/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NoteQuery
// ====================================================

export interface NoteQuery_note_deck {
  __typename: "Deck";
  /**
   * Title of the deck
   */
  title: string;
}

export interface NoteQuery_note_model_primaryField {
  __typename: "Field";
  /**
   * Field id
   */
  id: string;
}

export interface NoteQuery_note_model {
  __typename: "CardModel";
  /**
   * Primary field that should represent each individual note
   * of this model.
   */
  primaryField: NoteQuery_note_model_primaryField | null;
}

export interface NoteQuery_note_values_data_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string | null;
  offset: number | null;
  length: number | null;
}

export interface NoteQuery_note_values_data_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface NoteQuery_note_values_data_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: (NoteQuery_note_values_data_blocks_inlineStyleRanges | null)[] | null;
  entityRanges: (NoteQuery_note_values_data_blocks_entityRanges | null)[] | null;
  data: any | null;
}

export interface NoteQuery_note_values_data {
  __typename: "ContentState";
  id: string;
  blocks: (NoteQuery_note_values_data_blocks | null)[] | null;
  entityMap: any | null;
}

export interface NoteQuery_note_values_field {
  __typename: "Field";
  /**
   * Field id
   */
  id: string;
  /**
   * Name of the field
   */
  name: string;
}

export interface NoteQuery_note_values {
  __typename: "FieldValue";
  /**
   * Field value id
   */
  id: string;
  /**
   * Field data
   */
  data: NoteQuery_note_values_data | null;
  /**
   * Associated field
   */
  field: NoteQuery_note_values_field | null;
}

export interface NoteQuery_note {
  __typename: "Note";
  /**
   * Note id
   */
  id: string;
  /**
   * Deck containing this note
   */
  deck: NoteQuery_note_deck | null;
  /**
   * Model of this note
   */
  model: NoteQuery_note_model | null;
  /**
   * Values of this note
   */
  values: (NoteQuery_note_values | null)[] | null;
}

export interface NoteQuery {
  /**
   * Get single note
   */
  note: NoteQuery_note | null;
}

export interface NoteQueryVariables {
  noteId: string;
}
