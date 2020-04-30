/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FieldInput, TemplateInput } from './../../../globalTypes'

// ====================================================
// GraphQL mutation operation: CreateModelMutation
// ====================================================

export interface CreateModelMutation_createModel_templates {
  __typename: 'Template'
  /**
   * Template id
   */
  id: string
  /**
   * Name of the template
   */
  name: string | null
}

export interface CreateModelMutation_createModel_fields {
  __typename: 'Field'
  /**
   * Field id
   */
  id: string
  /**
   * Name of the field
   */
  name: string
}

export interface CreateModelMutation_createModel {
  __typename: 'Model'
  /**
   * Card model id
   */
  id: string
  /**
   * Name of this card model (e.g. "Basic", "Basic with Reversed")
   */
  name: string | null
  /**
   * Templates associated with this model
   */
  templates: CreateModelMutation_createModel_templates[]
  /**
   * Fields associated with this model
   */
  fields: CreateModelMutation_createModel_fields[]
}

export interface CreateModelMutation {
  /**
   * Create a new model
   */
  createModel: CreateModelMutation_createModel | null
}

export interface CreateModelMutationVariables {
  name: string
  fields: FieldInput[]
  templates: TemplateInput[]
}
