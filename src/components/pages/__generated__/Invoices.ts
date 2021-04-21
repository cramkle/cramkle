/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Invoices
// ====================================================

export interface Invoices_me_invoices_pageInfo {
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

export interface Invoices_me_invoices_edges_node {
  __typename: "Invoice";
  /**
   * The ID of an object
   */
  id: string;
  number: string | null;
  currency: string;
  subTotal: number;
  total: number;
  hostedUrl: string | null;
  periodEnd: string;
  cardBrand: string;
  cardLast4Digits: string;
}

export interface Invoices_me_invoices_edges {
  __typename: "InvoiceEdge";
  /**
   * The item at the end of the edge
   */
  node: Invoices_me_invoices_edges_node | null;
}

export interface Invoices_me_invoices {
  __typename: "InvoiceConnection";
  totalCount: number;
  /**
   * Information to aid in pagination.
   */
  pageInfo: Invoices_me_invoices_pageInfo;
  /**
   * A list of edges.
   */
  edges: (Invoices_me_invoices_edges | null)[] | null;
}

export interface Invoices_me {
  __typename: "User";
  /**
   * The ID of an object
   */
  id: string;
  invoices: Invoices_me_invoices;
}

export interface Invoices {
  /**
   * Get currently logged user
   */
  me: Invoices_me | null;
}

export interface InvoicesVariables {
  first: number;
  after?: string | null;
}
