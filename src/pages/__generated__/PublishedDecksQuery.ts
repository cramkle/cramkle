/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PublishedDecksQuery
// ====================================================

export interface PublishedDecksQuery_publishedDecks_edges_node_owner {
  __typename: "User";
  /**
   * User's username
   */
  username: string;
}

export interface PublishedDecksQuery_publishedDecks_edges_node {
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
   * Number of notes in this deck
   */
  totalNotes: number;
  /**
   * Number of flashcards in this deck
   */
  totalFlashcards: number;
  /**
   * Whether this deck is published to the marketplace
   */
  published: boolean;
  /**
   * Owner of the deck
   */
  owner: PublishedDecksQuery_publishedDecks_edges_node_owner | null;
}

export interface PublishedDecksQuery_publishedDecks_edges {
  __typename: "DeckEdge";
  /**
   * The item at the end of the edge
   */
  node: PublishedDecksQuery_publishedDecks_edges_node | null;
}

export interface PublishedDecksQuery_publishedDecks_pageCursors_first {
  __typename: "PageCursor";
  cursor: string;
  page: number;
  isCurrent: boolean;
}

export interface PublishedDecksQuery_publishedDecks_pageCursors_last {
  __typename: "PageCursor";
  cursor: string;
  page: number;
  isCurrent: boolean;
}

export interface PublishedDecksQuery_publishedDecks_pageCursors_around {
  __typename: "PageCursor";
  isCurrent: boolean;
  cursor: string;
  page: number;
}

export interface PublishedDecksQuery_publishedDecks_pageCursors_previous {
  __typename: "PageCursor";
  isCurrent: boolean;
  page: number;
  cursor: string;
}

export interface PublishedDecksQuery_publishedDecks_pageCursors {
  __typename: "PageCursors";
  /**
   * Optional, may be included in `around` (if current page is near the beginning).
   */
  first: PublishedDecksQuery_publishedDecks_pageCursors_first | null;
  /**
   * Optional, may be included in `around` (if current page is near the end).
   */
  last: PublishedDecksQuery_publishedDecks_pageCursors_last | null;
  /**
   * Always includes current page
   */
  around: PublishedDecksQuery_publishedDecks_pageCursors_around[];
  previous: PublishedDecksQuery_publishedDecks_pageCursors_previous | null;
}

export interface PublishedDecksQuery_publishedDecks_pageInfo {
  __typename: "PageInfo";
  /**
   * When paginating forwards, the cursor to continue.
   */
  endCursor: string | null;
  /**
   * When paginating backwards, the cursor to continue.
   */
  startCursor: string | null;
  /**
   * When paginating backwards, are there more items?
   */
  hasPreviousPage: boolean;
  /**
   * When paginating forwards, are there more items?
   */
  hasNextPage: boolean;
}

export interface PublishedDecksQuery_publishedDecks {
  __typename: "DeckConnection";
  totalCount: number;
  /**
   * A list of edges.
   */
  edges: (PublishedDecksQuery_publishedDecks_edges | null)[] | null;
  pageCursors: PublishedDecksQuery_publishedDecks_pageCursors;
  /**
   * Information to aid in pagination.
   */
  pageInfo: PublishedDecksQuery_publishedDecks_pageInfo;
}

export interface PublishedDecksQuery {
  /**
   * Retrieve all published decks
   */
  publishedDecks: PublishedDecksQuery_publishedDecks | null;
}

export interface PublishedDecksQueryVariables {
  page: number;
  size: number;
}
