import { Document, Schema, Types, model as mongooseModel } from 'mongoose'

export interface Model {
  name: string
  ownerId: Types.ObjectId
  primaryFieldId: Types.ObjectId
  fields: Types.Array<Types.ObjectId>
  templates: Types.Array<Types.ObjectId>
  notes: Types.Array<Types.ObjectId>
}

export interface ModelDocument extends Model, Document {}

const ModelSchema = new Schema<ModelDocument>({
  name: String,
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  primaryFieldId: {
    type: Schema.Types.ObjectId,
    ref: 'Field',
  },
  fields: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Field',
    },
  ],
  templates: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Template',
    },
  ],
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Note',
    },
  ],
})

export default mongooseModel<ModelDocument>('CardModel', ModelSchema)
