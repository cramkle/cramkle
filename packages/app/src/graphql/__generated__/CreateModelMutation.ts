/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { FieldInput, TemplateInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: CreateModelMutation
// ====================================================

export interface CreateModelMutation_createModel_templates {
  __typename: "Template";
  /**
   *  Template id 
   */
  id: string;
  /**
   *  Name of the template 
   */
  name: string | null;
}

export interface CreateModelMutation_createModel {
  __typename: "CardModel";
  /**
   *  Card model id 
   */
  id: string;
  /**
   *  Name of this card model (e.g. "Basic", "Basic with Reversed")
   */
  name: string | null;
  /**
   *  Templates associated with this model 
   */
  templates: (CreateModelMutation_createModel_templates | null)[] | null;
}

export interface CreateModelMutation {
  /**
   *  Create a new model 
   */
  createModel: CreateModelMutation_createModel | null;
}

export interface CreateModelMutationVariables {
  name: string;
  fields?: (FieldInput | null)[] | null;
  templates?: (TemplateInput | null)[] | null;
}
