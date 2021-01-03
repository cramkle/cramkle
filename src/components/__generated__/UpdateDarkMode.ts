/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateDarkMode
// ====================================================

export interface UpdateDarkMode_updatePreferences_user_preferences {
  __typename: "UserPreferences";
  /**
   * User preferred dark mode or not
   */
  darkMode: boolean;
}

export interface UpdateDarkMode_updatePreferences_user {
  __typename: "User";
  /**
   * The ID of an object
   */
  id: string;
  preferences: UpdateDarkMode_updatePreferences_user_preferences;
}

export interface UpdateDarkMode_updatePreferences {
  __typename: "UpdatePreferencesPayload";
  user: UpdateDarkMode_updatePreferences_user | null;
}

export interface UpdateDarkMode {
  /**
   * Update user account preferences
   */
  updatePreferences: UpdateDarkMode_updatePreferences | null;
}

export interface UpdateDarkModeVariables {
  darkMode: boolean;
}
