/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RegisterUserMutation
// ====================================================

export interface RegisterUserMutation_createUser {
  __typename: "User";
  /**
   * User id
   */
  id: string;
}

export interface RegisterUserMutation {
  /**
   * Create a new user
   */
  createUser: RegisterUserMutation_createUser | null;
}

export interface RegisterUserMutationVariables {
  username: string;
  email: string;
  password: string;
}
