/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUserLocale
// ====================================================

export interface UpdateUserLocale_updatePreferences_user_preferences {
  __typename: "UserPreferences";
  /**
   * User preferred locale
   */
  locale: string | null;
}

export interface UpdateUserLocale_updatePreferences_user {
  __typename: "User";
  /**
   * The ID of an object
   */
  id: string;
  preferences: UpdateUserLocale_updatePreferences_user_preferences;
}

export interface UpdateUserLocale_updatePreferences {
  __typename: "UpdatePreferencesPayload";
  user: UpdateUserLocale_updatePreferences_user | null;
}

export interface UpdateUserLocale {
  /**
   * Update user account preferences
   */
  updatePreferences: UpdateUserLocale_updatePreferences | null;
}

export interface UpdateUserLocaleVariables {
  locale: string;
}
