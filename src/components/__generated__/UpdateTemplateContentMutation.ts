/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ContentStateInput } from './../../globalTypes'

// ====================================================
// GraphQL mutation operation: UpdateTemplateContentMutation
// ====================================================

export interface UpdateTemplateContentMutation_updateTemplate {
  __typename: 'Template'
  /**
   * Template id
   */
  id: string
}

export interface UpdateTemplateContentMutation {
  /**
   * Updates an existing template
   */
  updateTemplate: UpdateTemplateContentMutation_updateTemplate | null
}

export interface UpdateTemplateContentMutationVariables {
  id: string
  frontSide?: ContentStateInput | null
  backSide?: ContentStateInput | null
}
