import { GraphQLInputObjectType, GraphQLObjectType } from 'graphql'

import { FieldModel } from '../../mongo'
import { FieldValueDocument } from '../../mongo/Note'
import { graphQLGlobalIdField } from '../../utils/graphqlID'
import { ContentStateInputType, ContentStateType } from '../contentState/types'
import { FieldInputType, FieldType } from '../field/types'
import { nodeInterface } from '../node/types'

export const FieldValueType = new GraphQLObjectType<
  FieldValueDocument,
  Context
>({
  name: 'FieldValue',
  description: `
Holds the value for a particular field in a card model.

Contained by the note.
  `.trim(),
  interfaces: [nodeInterface],
  fields: {
    id: graphQLGlobalIdField(),
    field: {
      type: FieldType,
      description: 'Associated field',
      resolve: (root) => FieldModel.findById(root.fieldId),
    },
    data: {
      type: ContentStateType,
      description: 'Field data',
    },
  },
})

export const FieldValueInput = new GraphQLInputObjectType({
  name: 'FieldValueInput',
  fields: {
    data: { type: ContentStateInputType },
    field: { type: FieldInputType },
  },
})
