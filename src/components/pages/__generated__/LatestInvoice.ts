/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: LatestInvoice
// ====================================================

export interface LatestInvoice_me_invoices_edges_node {
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

export interface LatestInvoice_me_invoices_edges {
  __typename: "InvoiceEdge";
  /**
   * The item at the end of the edge
   */
  node: LatestInvoice_me_invoices_edges_node | null;
}

export interface LatestInvoice_me_invoices {
  __typename: "InvoiceConnection";
  totalCount: number;
  /**
   * A list of edges.
   */
  edges: (LatestInvoice_me_invoices_edges | null)[] | null;
}

export interface LatestInvoice_me {
  __typename: "User";
  /**
   * The ID of an object
   */
  id: string;
  invoices: LatestInvoice_me_invoices;
}

export interface LatestInvoice {
  /**
   * Get currently logged user
   */
  me: LatestInvoice_me | null;
}

export interface LatestInvoiceVariables {
  first: number;
}
