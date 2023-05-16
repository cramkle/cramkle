/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Error } from "./../../../../../../globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateProfile
// ====================================================

export interface UpdateProfile_updateProfile_user {
  __typename: "User";
  /**
   * The ID of an object
   */
  id: string;
  /**
   * User's username
   */
  username: string;
  /**
   * User's email
   */
  email: string | null;
  anonymous: boolean;
}

export interface UpdateProfile_updateProfile_error_fields {
  __typename: "ErrorValue";
  fieldName: string;
  errorDescription: string;
}

export interface UpdateProfile_updateProfile_error {
  __typename: "UpdateProfileError";
  type: Error;
  status: number;
  fields: UpdateProfile_updateProfile_error_fields[] | null;
}

export interface UpdateProfile_updateProfile {
  __typename: "UpdateProfilePayload";
  user: UpdateProfile_updateProfile_user | null;
  error: UpdateProfile_updateProfile_error | null;
}

export interface UpdateProfile {
  /**
   * Update user profile information
   */
  updateProfile: UpdateProfile_updateProfile | null;
}

export interface UpdateProfileVariables {
  email?: string | null;
  username?: string | null;
  password?: string | null;
}
