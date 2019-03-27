import { Schema, model, Document } from 'mongoose'

import { Block } from './Block'

export interface Template {
  name: string
  frontSide: Block[]
  backSide: Block[]
}

export interface TemplateDocument extends Template, Document {}

const TemplateSchema = new Schema<TemplateDocument>({
  name: String,
  frontSide: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Block',
    },
  ],
  backSide: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Block',
    },
  ],
  modelId: {
    type: Schema.Types.ObjectId,
    ref: 'CardModel',
  },
})

export default model<TemplateDocument>('Template', TemplateSchema)
