import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

import { FieldModel, NoteModel, TemplateModel, UserModel } from '../../mongo'
import { ModelDocument } from '../../mongo/Model'
import { graphQLGlobalIdField } from '../../utils/graphqlID'
import { getModelPrimaryField } from '../../utils/modelPrimaryField'
import { NoteType } from '../deck/types'
import { FieldType } from '../field/types'
import { TemplateType } from '../template/types'
import { UserType } from '../user/types'

export const ModelType: GraphQLObjectType<
  ModelDocument,
  Context
> = new GraphQLObjectType<ModelDocument, Context>({
  name: 'Model',
  description: 'Represents a model for a collection of notes.',
  fields: () => ({
    id: graphQLGlobalIdField(),
    name: {
      type: GraphQLString,
      description:
        'Name of this card model (e.g. "Basic", "Basic with Reversed")',
    },
    owner: {
      type: UserType,
      description: 'Owner user entity',
      resolve: (root) => UserModel.findById(root.ownerId),
    },
    primaryField: {
      type: FieldType,
      description:
        'Primary field that should represent each individual note of this model.',
      resolve: (root) => getModelPrimaryField(root),
    },
    templates: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TemplateType))),
      description: 'Templates associated with this model',
      resolve: (root) => TemplateModel.find({ modelId: root._id }),
    },
    fields: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(FieldType))),
      description: 'Fields associated with this model',
      resolve: (root) => FieldModel.find({ modelId: root._id }),
    },
    notes: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(NoteType))),
      description: 'Notes associated with this model',
      resolve: (root) => NoteModel.find({ modelId: root._id }),
    },
  }),
})
