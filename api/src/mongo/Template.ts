import { Document, Schema, model } from 'mongoose'

import { ContentStateDocument, ContentStateSchema } from './ContentState'

export interface Template {
  name: string
  frontSide: ContentStateDocument
  backSide: ContentStateDocument
  modelId: Schema.Types.ObjectId
  ownerId: Schema.Types.ObjectId
}

export interface TemplateDocument extends Template, Document {}

const TemplateSchema = new Schema<TemplateDocument>({
  name: String,
  frontSide: ContentStateSchema,
  backSide: ContentStateSchema,
  modelId: {
    type: Schema.Types.ObjectId,
    ref: 'Model',
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

export default model<TemplateDocument>('Template', TemplateSchema)
