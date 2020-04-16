/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CardStatus } from "./../../../../__generated__/globalTypes";

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

export interface NoteQuery_note_cards_template_frontSide_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string | null;
  offset: number | null;
  length: number | null;
}

export interface NoteQuery_note_cards_template_frontSide_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface NoteQuery_note_cards_template_frontSide_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: (NoteQuery_note_cards_template_frontSide_blocks_inlineStyleRanges | null)[] | null;
  entityRanges: (NoteQuery_note_cards_template_frontSide_blocks_entityRanges | null)[] | null;
  data: any | null;
}

export interface NoteQuery_note_cards_template_frontSide {
  __typename: "ContentState";
  id: string;
  blocks: (NoteQuery_note_cards_template_frontSide_blocks | null)[] | null;
  entityMap: any | null;
}

export interface NoteQuery_note_cards_template_backSide_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string | null;
  offset: number | null;
  length: number | null;
}

export interface NoteQuery_note_cards_template_backSide_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface NoteQuery_note_cards_template_backSide_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: (NoteQuery_note_cards_template_backSide_blocks_inlineStyleRanges | null)[] | null;
  entityRanges: (NoteQuery_note_cards_template_backSide_blocks_entityRanges | null)[] | null;
  data: any | null;
}

export interface NoteQuery_note_cards_template_backSide {
  __typename: "ContentState";
  id: string;
  blocks: (NoteQuery_note_cards_template_backSide_blocks | null)[] | null;
  entityMap: any | null;
}

export interface NoteQuery_note_cards_template {
  __typename: "Template";
  /**
   * Name of the template
   */
  name: string | null;
  /**
   * Front side template
   */
  frontSide: NoteQuery_note_cards_template_frontSide | null;
  /**
   * Back side template
   */
  backSide: NoteQuery_note_cards_template_backSide | null;
}

export interface NoteQuery_note_cards {
  __typename: "Card";
  /**
   * Card id.
   */
  id: string;
  /**
   * Whether to be filtered of not.
   * 
   * Acts like a logical deletion it when comes to the review.
   */
  active: boolean | null;
  /**
   * Number of times the user has forgotten the answer
   * to this card.
   */
  lapses: number | null;
  /**
   * Due date of this card, in a timestamp format.
   */
  due: number | null;
  /**
   * Current status of this card.
   */
  state: CardStatus | null;
  /**
   * Template associated with this card.
   */
  template: NoteQuery_note_cards_template | null;
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
  /**
   * Generated cards
   */
  cards: (NoteQuery_note_cards | null)[] | null;
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
