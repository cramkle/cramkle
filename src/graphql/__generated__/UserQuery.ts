/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserQuery
// ====================================================

export interface UserQuery_user {
  __typename: "User";
  /**
   *  User id 
   */
  id: string;
  /**
   *  User's username 
   */
  username: string | null;
  /**
   *  User's e-mail 
   */
  email: string | null;
}

export interface UserQuery {
  /**
   *  Get currently logged user 
   */
  user: UserQuery_user | null;
}
