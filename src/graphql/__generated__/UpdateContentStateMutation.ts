/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ContentStateInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateContentStateMutation
// ====================================================

export interface UpdateContentStateMutation_updateContentState {
  __typename: "ContentState";
  id: string;
}

export interface UpdateContentStateMutation {
  /**
   *  Update a content state 
   */
  updateContentState: UpdateContentStateMutation_updateContentState | null;
}

export interface UpdateContentStateMutationVariables {
  id: string;
  contentState?: ContentStateInput | null;
}
