/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RequestPasswordReset
// ====================================================

export interface RequestPasswordReset_requestPasswordReset {
  __typename: "RequestPasswordResetPayload";
  /**
   * Whether we could successfully send the email or not
   */
  success: boolean | null;
}

export interface RequestPasswordReset {
  /**
   * Request a user password reset given an email
   */
  requestPasswordReset: RequestPasswordReset_requestPasswordReset | null;
}

export interface RequestPasswordResetVariables {
  email: string;
}
