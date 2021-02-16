/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserQuery
// ====================================================

export interface UserQuery_me_preferences {
  __typename: "UserPreferences";
  /**
   * User preferred timezone
   */
  zoneInfo: string;
  /**
   * User preferred locale
   */
  locale: string | null;
  /**
   * User preferred dark mode or not
   */
  darkMode: boolean;
}

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
  anonymous: boolean;
  preferences: UserQuery_me_preferences;
}

export interface UserQuery {
  /**
   * Get currently logged user
   */
  me: UserQuery_me | null;
}
