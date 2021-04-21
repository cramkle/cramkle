/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: InvoiceDetails_invoice
// ====================================================

export interface InvoiceDetails_invoice {
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
