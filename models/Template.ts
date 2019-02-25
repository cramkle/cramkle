import { Schema, model } from 'mongoose'

const TemplateSchema = new Schema({
  name: String,
  frontSide: String,
  backSide: String,
  modelId: {
    type: Schema.Types.ObjectId,
    ref: 'CardModel',
  },
})

const Template = model('Template', TemplateSchema)

export default Template
