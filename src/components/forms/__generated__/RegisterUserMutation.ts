/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RegisterUserMutation
// ====================================================

export interface RegisterUserMutation_createUser_user {
  __typename: "User";
  /**
   * The ID of an object
   */
  id: string;
}

export interface RegisterUserMutation_createUser {
  __typename: "CreateUserPayload";
  /**
   * Created user
   */
  user: RegisterUserMutation_createUser_user | null;
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
