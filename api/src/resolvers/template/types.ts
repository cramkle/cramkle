import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

import { ModelModel } from '../../mongo'
import { TemplateDocument } from '../../mongo/Template'
import { graphQLGlobalIdField } from '../../utils/graphqlID'
import { ContentStateType } from '../contentState/types'
import { ModelType } from '../model/types'

export const TemplateType = new GraphQLObjectType<TemplateDocument, Context>({
  name: 'Template',
  description: `
Template of the card. This is what structures the content
of each card with values provided by the note
  `.trim(),
  fields: () => ({
    id: graphQLGlobalIdField(),
    name: {
      type: GraphQLNonNull(GraphQLString),
      description: 'Name of the template',
    },
    frontSide: {
      type: ContentStateType,
      description: 'Front side template',
    },
    backSide: {
      type: ContentStateType,
      description: 'Back side template',
    },
    model: {
      type: ModelType,
      description: 'Associated model',
      resolve: (root: TemplateDocument) => ModelModel.findById(root.modelId),
    },
  }),
})

export const TemplateInputType = new GraphQLInputObjectType({
  name: 'TemplateInput',
  fields: {
    name: { type: GraphQLNonNull(GraphQLString) },
  },
})
