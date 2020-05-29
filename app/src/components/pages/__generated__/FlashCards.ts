/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FlashCards
// ====================================================

export interface FlashCards_studyFlashCard_template_frontSide_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string;
  offset: number;
  length: number;
}

export interface FlashCards_studyFlashCard_template_frontSide_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface FlashCards_studyFlashCard_template_frontSide_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: FlashCards_studyFlashCard_template_frontSide_blocks_inlineStyleRanges[];
  entityRanges: FlashCards_studyFlashCard_template_frontSide_blocks_entityRanges[];
  data: any | null;
}

export interface FlashCards_studyFlashCard_template_frontSide {
  __typename: "ContentState";
  /**
   * The ID of an object
   */
  id: string;
  blocks: FlashCards_studyFlashCard_template_frontSide_blocks[];
  entityMap: any;
}

export interface FlashCards_studyFlashCard_template_backSide_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string;
  offset: number;
  length: number;
}

export interface FlashCards_studyFlashCard_template_backSide_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface FlashCards_studyFlashCard_template_backSide_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: FlashCards_studyFlashCard_template_backSide_blocks_inlineStyleRanges[];
  entityRanges: FlashCards_studyFlashCard_template_backSide_blocks_entityRanges[];
  data: any | null;
}

export interface FlashCards_studyFlashCard_template_backSide {
  __typename: "ContentState";
  /**
   * The ID of an object
   */
  id: string;
  blocks: FlashCards_studyFlashCard_template_backSide_blocks[];
  entityMap: any;
}

export interface FlashCards_studyFlashCard_template {
  __typename: "Template";
  /**
   * Front side template
   */
  frontSide: FlashCards_studyFlashCard_template_frontSide | null;
  /**
   * Back side template
   */
  backSide: FlashCards_studyFlashCard_template_backSide | null;
}

export interface FlashCards_studyFlashCard_note_values_data_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string;
  offset: number;
  length: number;
}

export interface FlashCards_studyFlashCard_note_values_data_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface FlashCards_studyFlashCard_note_values_data_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: FlashCards_studyFlashCard_note_values_data_blocks_inlineStyleRanges[];
  entityRanges: FlashCards_studyFlashCard_note_values_data_blocks_entityRanges[];
  data: any | null;
}

export interface FlashCards_studyFlashCard_note_values_data {
  __typename: "ContentState";
  /**
   * The ID of an object
   */
  id: string;
  blocks: FlashCards_studyFlashCard_note_values_data_blocks[];
  entityMap: any;
}

export interface FlashCards_studyFlashCard_note_values_field {
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

export interface FlashCards_studyFlashCard_note_values {
  __typename: "FieldValue";
  /**
   * The ID of an object
   */
  id: string;
  /**
   * Field data
   */
  data: FlashCards_studyFlashCard_note_values_data | null;
  /**
   * Associated field
   */
  field: FlashCards_studyFlashCard_note_values_field | null;
}

export interface FlashCards_studyFlashCard_note {
  __typename: "Note";
  /**
   * The ID of an object
   */
  id: string;
  /**
   * Values of this note
   */
  values: FlashCards_studyFlashCard_note_values[];
}

export interface FlashCards_studyFlashCard {
  __typename: "FlashCard";
  /**
   * The ID of an object
   */
  id: string;
  /**
   * Template associated with this flashcard.
   */
  template: FlashCards_studyFlashCard_template | null;
  /**
   * Parent note of the flashcard.
   */
  note: FlashCards_studyFlashCard_note | null;
}

export interface FlashCards {
  /**
   * Retrieves the next flashcard for a study session in the given deck
   */
  studyFlashCard: FlashCards_studyFlashCard | null;
}

export interface FlashCardsVariables {
  deckSlug: string;
}
