/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteTemplate
// ====================================================

export interface DeleteTemplate_removeTemplateFromModel_template {
  __typename: "Template";
  /**
   * The ID of an object
   */
  id: string;
}

export interface DeleteTemplate_removeTemplateFromModel {
  __typename: "RemoveTemplateFromModelPayload";
  template: DeleteTemplate_removeTemplateFromModel_template | null;
}

export interface DeleteTemplate {
  /**
   * Removes a template from it's model and delete associated flashcards
   */
  removeTemplateFromModel: DeleteTemplate_removeTemplateFromModel | null;
}

export interface DeleteTemplateVariables {
  templateId: string;
}
