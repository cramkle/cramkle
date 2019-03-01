import { Schema, model, Document } from 'mongoose'

interface Template {
  name: string
  frontSide: string
  backSide: string
}

interface TemplateDocument extends Template, Document {}

const TemplateSchema = new Schema<TemplateDocument>({
  name: String,
  frontSide: String,
  backSide: String,
  modelId: {
    type: Schema.Types.ObjectId,
    ref: 'CardModel',
  },
})

export default model<TemplateDocument>('Template', TemplateSchema)
