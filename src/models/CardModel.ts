import { Schema, model, Document } from 'mongoose'

interface CardModel {
  name: string
  fields: Schema.Types.ObjectId[]
  templates: Schema.Types.ObjectId[]
  notes: Schema.Types.ObjectId[]
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
