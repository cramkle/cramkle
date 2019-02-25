import { Schema, model } from 'mongoose'

const FieldSchema = new Schema({
  name: { type: String, required: true },
  isRequired: Boolean,
  type: {
    type: String,
    enum: ['STRING', 'NUMBER', 'DATE', 'IMAGE'],
  },
  modelId: {
    type: Schema.Types.ObjectId,
    ref: 'CardModel',
  },
})

const Field = model('Field', FieldSchema)

export default Field
