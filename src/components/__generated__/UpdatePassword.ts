/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Error } from "./../../globalTypes";

// ====================================================
// GraphQL mutation operation: UpdatePassword
// ====================================================

export interface UpdatePassword_updateProfile_user {
  __typename: "User";
  /**
   * The ID of an object
   */
  id: string;
}

export interface UpdatePassword_updateProfile_error_fields {
  __typename: "ErrorValue";
  fieldName: string;
  errorDescription: string;
}

export interface UpdatePassword_updateProfile_error {
  __typename: "UpdateProfileError";
  type: Error;
  status: number;
  fields: UpdatePassword_updateProfile_error_fields[] | null;
}

export interface UpdatePassword_updateProfile {
  __typename: "UpdateProfilePayload";
  user: UpdatePassword_updateProfile_user | null;
  error: UpdatePassword_updateProfile_error | null;
}

export interface UpdatePassword {
  /**
   * Update user profile information
   */
  updateProfile: UpdatePassword_updateProfile | null;
}

export interface UpdatePasswordVariables {
  currentPassword: string;
  newPassword: string;
}
