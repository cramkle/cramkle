/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdatePreferences
// ====================================================

export interface UpdatePreferences_updatePreferences_user_preferences {
  __typename: "UserPreferences";
  /**
   * User preferred timezone
   */
  zoneInfo: string;
  /**
   * User preferred locale
   */
  locale: string | null;
}

export interface UpdatePreferences_updatePreferences_user {
  __typename: "User";
  /**
   * The ID of an object
   */
  id: string;
  preferences: UpdatePreferences_updatePreferences_user_preferences | null;
}

export interface UpdatePreferences_updatePreferences {
  __typename: "UpdatePreferencesPayload";
  user: UpdatePreferences_updatePreferences_user | null;
}

export interface UpdatePreferences {
  /**
   * Update user account preferences
   */
  updatePreferences: UpdatePreferences_updatePreferences | null;
}

export interface UpdatePreferencesVariables {
  timeZone?: string | null;
  locale?: string | null;
}
