/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FlashCardStatus } from "./../../../../../../../../globalTypes";

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
   * The ID of an object
   */
  id: string;
}

export interface NoteQuery_note_model {
  __typename: "Model";
  /**
   * Primary field that should represent each individual note of this model.
   */
  primaryField: NoteQuery_note_model_primaryField | null;
}

export interface NoteQuery_note_values_data_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string;
  offset: number;
  length: number;
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
  inlineStyleRanges: NoteQuery_note_values_data_blocks_inlineStyleRanges[];
  entityRanges: NoteQuery_note_values_data_blocks_entityRanges[];
  data: any | null;
}

export interface NoteQuery_note_values_data {
  __typename: "ContentState";
  /**
   * The ID of an object
   */
  id: string;
  blocks: NoteQuery_note_values_data_blocks[];
  entityMap: any;
}

export interface NoteQuery_note_values_field {
  __typename: "Field";
  /**
   * The ID of an object
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
   * The ID of an object
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

export interface NoteQuery_note_flashCards_template_frontSide_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string;
  offset: number;
  length: number;
}

export interface NoteQuery_note_flashCards_template_frontSide_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface NoteQuery_note_flashCards_template_frontSide_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: NoteQuery_note_flashCards_template_frontSide_blocks_inlineStyleRanges[];
  entityRanges: NoteQuery_note_flashCards_template_frontSide_blocks_entityRanges[];
  data: any | null;
}

export interface NoteQuery_note_flashCards_template_frontSide {
  __typename: "ContentState";
  /**
   * The ID of an object
   */
  id: string;
  blocks: NoteQuery_note_flashCards_template_frontSide_blocks[];
  entityMap: any;
}

export interface NoteQuery_note_flashCards_template_backSide_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string;
  offset: number;
  length: number;
}

export interface NoteQuery_note_flashCards_template_backSide_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface NoteQuery_note_flashCards_template_backSide_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: NoteQuery_note_flashCards_template_backSide_blocks_inlineStyleRanges[];
  entityRanges: NoteQuery_note_flashCards_template_backSide_blocks_entityRanges[];
  data: any | null;
}

export interface NoteQuery_note_flashCards_template_backSide {
  __typename: "ContentState";
  /**
   * The ID of an object
   */
  id: string;
  blocks: NoteQuery_note_flashCards_template_backSide_blocks[];
  entityMap: any;
}

export interface NoteQuery_note_flashCards_template {
  __typename: "Template";
  /**
   * Name of the template
   */
  name: string;
  /**
   * Front side template
   */
  frontSide: NoteQuery_note_flashCards_template_frontSide | null;
  /**
   * Back side template
   */
  backSide: NoteQuery_note_flashCards_template_backSide | null;
}

export interface NoteQuery_note_flashCards {
  __typename: "FlashCard";
  /**
   * The ID of an object
   */
  id: string;
  /**
   * Whether to be filtered of not.
   * 
   * Acts like a logical deletion it when comes to the review.
   */
  active: boolean;
  /**
   * Number of times the user has forgotten the answer to this flashcard.
   */
  lapses: number;
  /**
   * Due date of this flashcard, in a timestamp format.
   */
  due: number | null;
  /**
   * Current status of this flashcard.
   */
  status: FlashCardStatus | null;
  /**
   * Template associated with this flashcard.
   */
  template: NoteQuery_note_flashCards_template | null;
}

export interface NoteQuery_note {
  __typename: "Note";
  /**
   * The ID of an object
   */
  id: string;
  /**
   * Note text representation
   */
  text: string | null;
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
  values: NoteQuery_note_values[];
  /**
   * Generated flashcards
   */
  flashCards: NoteQuery_note_flashCards[];
}

export interface NoteQuery {
  /**
   * Get single note by it's id
   */
  note: NoteQuery_note | null;
}

export interface NoteQueryVariables {
  noteId: string;
}
