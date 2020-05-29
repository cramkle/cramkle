/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ResetPassword
// ====================================================

export interface ResetPassword_resetPassword {
  __typename: "ResetPasswordPayload";
  success: boolean | null;
}

export interface ResetPassword {
  /**
   * Resets the user's password
   */
  resetPassword: ResetPassword_resetPassword | null;
}

export interface ResetPasswordVariables {
  userId: string;
  token: string;
  timestamp: string;
  newPassword: string;
}
