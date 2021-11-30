/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FlashCardStatus } from "./../../globalTypes";

// ====================================================
// GraphQL query operation: PublishedDeckQuery
// ====================================================

export interface PublishedDeckQuery_publishedDeck_owner {
  __typename: "User";
  /**
   * User's username
   */
  username: string;
}

export interface PublishedDeckQuery_publishedDeck_notes_edges_node_model {
  __typename: "Model";
  /**
   * Name of this card model (e.g. "Basic", "Basic with Reversed")
   */
  name: string;
}

export interface PublishedDeckQuery_publishedDeck_notes_edges_node_flashCards_template {
  __typename: "Template";
  /**
   * Name of the template
   */
  name: string;
}

export interface PublishedDeckQuery_publishedDeck_notes_edges_node_flashCards {
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
   * Current status of this flashcard.
   */
  status: FlashCardStatus | null;
  /**
   * Due date of this flashcard, in a timestamp format.
   */
  due: number | null;
  /**
   * Template associated with this flashcard.
   */
  template: PublishedDeckQuery_publishedDeck_notes_edges_node_flashCards_template | null;
}

export interface PublishedDeckQuery_publishedDeck_notes_edges_node {
  __typename: "Note";
  /**
   * Note text representation
   */
  text: string | null;
  /**
   * The ID of an object
   */
  id: string;
  /**
   * Model of this note
   */
  model: PublishedDeckQuery_publishedDeck_notes_edges_node_model | null;
  /**
   * Generated flashcards
   */
  flashCards: PublishedDeckQuery_publishedDeck_notes_edges_node_flashCards[];
}

export interface PublishedDeckQuery_publishedDeck_notes_edges {
  __typename: "NoteEdge";
  /**
   * The item at the end of the edge
   */
  node: PublishedDeckQuery_publishedDeck_notes_edges_node | null;
}

export interface PublishedDeckQuery_publishedDeck_notes_pageInfo {
  __typename: "PageInfo";
  /**
   * When paginating forwards, are there more items?
   */
  hasNextPage: boolean;
  /**
   * When paginating forwards, the cursor to continue.
   */
  endCursor: string | null;
}

export interface PublishedDeckQuery_publishedDeck_notes_pageCursors_first {
  __typename: "PageCursor";
  cursor: string;
  page: number;
  isCurrent: boolean;
}

export interface PublishedDeckQuery_publishedDeck_notes_pageCursors_around {
  __typename: "PageCursor";
  cursor: string;
  page: number;
  isCurrent: boolean;
}

export interface PublishedDeckQuery_publishedDeck_notes_pageCursors_last {
  __typename: "PageCursor";
  cursor: string;
  page: number;
  isCurrent: boolean;
}

export interface PublishedDeckQuery_publishedDeck_notes_pageCursors_previous {
  __typename: "PageCursor";
  cursor: string;
  page: number;
  isCurrent: boolean;
}

export interface PublishedDeckQuery_publishedDeck_notes_pageCursors {
  __typename: "PageCursors";
  /**
   * Optional, may be included in `around` (if current page is near the beginning).
   */
  first: PublishedDeckQuery_publishedDeck_notes_pageCursors_first | null;
  /**
   * Always includes current page
   */
  around: PublishedDeckQuery_publishedDeck_notes_pageCursors_around[];
  /**
   * Optional, may be included in `around` (if current page is near the end).
   */
  last: PublishedDeckQuery_publishedDeck_notes_pageCursors_last | null;
  previous: PublishedDeckQuery_publishedDeck_notes_pageCursors_previous | null;
}

export interface PublishedDeckQuery_publishedDeck_notes {
  __typename: "NoteConnection";
  totalCount: number;
  /**
   * A list of edges.
   */
  edges: (PublishedDeckQuery_publishedDeck_notes_edges | null)[] | null;
  /**
   * Information to aid in pagination.
   */
  pageInfo: PublishedDeckQuery_publishedDeck_notes_pageInfo;
  pageCursors: PublishedDeckQuery_publishedDeck_notes_pageCursors;
}

export interface PublishedDeckQuery_publishedDeck {
  __typename: "Deck";
  /**
   * The ID of an object
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
   * Whether this deck is published to the marketplace
   */
  published: boolean;
  /**
   * Number of notes in this deck
   */
  totalNotes: number;
  /**
   * Number of flashcards in this deck
   */
  totalFlashcards: number;
  /**
   * Owner of the deck
   */
  owner: PublishedDeckQuery_publishedDeck_owner | null;
  /**
   * Notes contained in this deck
   */
  notes: PublishedDeckQuery_publishedDeck_notes | null;
}

export interface PublishedDeckQuery {
  /**
   * Get single published deck by it's slug
   */
  publishedDeck: PublishedDeckQuery_publishedDeck | null;
}

export interface PublishedDeckQueryVariables {
  slug: string;
  page: number;
  size: number;
  search?: string | null;
}
