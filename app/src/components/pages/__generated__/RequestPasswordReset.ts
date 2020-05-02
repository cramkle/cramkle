/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RequestPasswordReset
// ====================================================

export interface RequestPasswordReset_requestPasswordReset {
  __typename: 'RequestPasswordResetPayload'
  success: boolean
}

export interface RequestPasswordReset {
  /**
   * Request a user password reset given an email
   */
  requestPasswordReset: RequestPasswordReset_requestPasswordReset
}

export interface RequestPasswordResetVariables {
  email: string
}
