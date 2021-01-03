/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Error } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: RegisterUser
// ====================================================

export interface RegisterUser_createUser_user {
  __typename: "User";
  /**
   * The ID of an object
   */
  id: string;
}

export interface RegisterUser_createUser_error_fields {
  __typename: "ErrorValue";
  fieldName: string;
  errorDescription: string;
}

export interface RegisterUser_createUser_error {
  __typename: "CreateUserError";
  type: Error;
  status: number;
  fields: RegisterUser_createUser_error_fields[] | null;
}

export interface RegisterUser_createUser {
  __typename: "CreateUserPayload";
  /**
   * Created user
   */
  user: RegisterUser_createUser_user | null;
  error: RegisterUser_createUser_error | null;
}

export interface RegisterUser {
  /**
   * Create a new user
   */
  createUser: RegisterUser_createUser | null;
}

export interface RegisterUserVariables {
  username: string;
  email: string;
  password: string;
  zoneInfo?: string | null;
}
