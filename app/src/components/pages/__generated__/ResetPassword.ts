/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ResetPassword
// ====================================================

export interface ResetPassword_resetPassword {
  __typename: "ResetPasswordPayload";
  success: boolean;
}

export interface ResetPassword {
  /**
   * Reset the user's password
   */
  resetPassword: ResetPassword_resetPassword;
}

export interface ResetPasswordVariables {
  userId: string;
  token: string;
  timestamp: string;
  newPassword: string;
}
