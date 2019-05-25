/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DeckQuery
// ====================================================

export interface DeckQuery_deck_notes_values_data_blocks_inlineStyleRanges {
  __typename: "InlineStyleRange";
  style: string | null;
  offset: number | null;
  length: number | null;
}

export interface DeckQuery_deck_notes_values_data_blocks_entityRanges {
  __typename: "EntityRange";
  key: number;
  length: number;
  offset: number;
}

export interface DeckQuery_deck_notes_values_data_blocks {
  __typename: "Block";
  key: string;
  type: string;
  text: string;
  depth: number;
  inlineStyleRanges: (DeckQuery_deck_notes_values_data_blocks_inlineStyleRanges | null)[] | null;
  entityRanges: (DeckQuery_deck_notes_values_data_blocks_entityRanges | null)[] | null;
  data: any | null;
}

export interface DeckQuery_deck_notes_values_data {
  __typename: "ContentState";
  id: string;
  blocks: (DeckQuery_deck_notes_values_data_blocks | null)[] | null;
  entityMap: any | null;
}

export interface DeckQuery_deck_notes_values {
  __typename: "FieldValue";
  /**
   * Field data
   */
  data: DeckQuery_deck_notes_values_data | null;
}

export interface DeckQuery_deck_notes_model {
  __typename: "CardModel";
  /**
   * Name of this card model (e.g. "Basic", "Basic with Reversed")
   */
  name: string | null;
}

export interface DeckQuery_deck_notes {
  __typename: "Note";
  /**
   * Note id
   */
  id: string;
  /**
   * Values of this note
   */
  values: (DeckQuery_deck_notes_values | null)[] | null;
  /**
   * Model of this note
   */
  model: DeckQuery_deck_notes_model | null;
}

export interface DeckQuery_deck {
  __typename: "Deck";
  /**
   * Deck id
   */
  id: string;
  /**
   * Unique identifiable slug
   */
  slug: string;
  /**
   * Title of the deck
   */
  title: string;
  /**
   * Description of the deck
   */
  description: string | null;
  /**
   * Notes contained in this deck
   */
  notes: (DeckQuery_deck_notes | null)[] | null;
}

export interface DeckQuery {
  /**
   * Get single deck
   */
  deck: DeckQuery_deck | null;
}

export interface DeckQueryVariables {
  slug: string;
}
