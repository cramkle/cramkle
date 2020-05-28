import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

import { ModelModel } from '../../mongo'
import { FieldDocument } from '../../mongo/Field'
import { graphQLGlobalIdField } from '../../utils/graphqlID'
import { ModelType } from '../model/types'
import { nodeInterface } from '../node/types'

export const FieldType: GraphQLObjectType<
  FieldDocument,
  Context
> = new GraphQLObjectType<FieldDocument, Context>({
  name: 'Field',
  interfaces: [nodeInterface],
  fields: {
    id: graphQLGlobalIdField(),
    name: {
      type: GraphQLNonNull(GraphQLString),
      description: 'Name of the field',
    },
    model: {
      type: ModelType,
      description: 'Associated model',
      resolve: (root) => ModelModel.findById(root.modelId),
    },
  },
})

export const FieldInputType = new GraphQLInputObjectType({
  name: 'FieldInput',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  },
})
