import { Document, Schema, Types, model } from 'mongoose'

interface CardModel {
  name: string
  fields: Types.Array<Types.ObjectId>
  templates: Types.Array<Types.ObjectId>
  notes: Types.Array<Types.ObjectId>
}

interface CardModelDocument extends CardModel, Document {}

const CardModelSchema = new Schema<CardModelDocument>({
  name: String,
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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

export default model<CardModelDocument>('CardModel', CardModelSchema)
