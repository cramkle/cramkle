import { Schema, model, Document } from 'mongoose'

export interface Template {
  name: string
  frontSideId: Schema.Types.ObjectId
  backSideId: Schema.Types.ObjectId
  modelId: Schema.Types.ObjectId
  ownerId: Schema.Types.ObjectId
}

export interface TemplateDocument extends Template, Document {}

const TemplateSchema = new Schema<TemplateDocument>({
  name: String,
  frontSideId: {
    type: Schema.Types.ObjectId,
    ref: 'ContentState',
  },
  backSideId: {
    type: Schema.Types.ObjectId,
    ref: 'ContentState',
  },
  modelId: {
    type: Schema.Types.ObjectId,
    ref: 'CardModel',
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

export default model<TemplateDocument>('Template', TemplateSchema)
