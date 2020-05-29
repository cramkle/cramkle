/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserQuery
// ====================================================

export interface UserQuery_me {
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
  email: string;
}

export interface UserQuery {
  /**
   * Get currently logged user
   */
  me: UserQuery_me | null;
}
