import { Schema, model, Document } from 'mongoose'

interface Field {
  name: string
  isRequired: boolean
  type: 'STRING' | 'NUMBER' | 'DATE' | 'IMAGE'
}

interface FieldDocument extends Field, Document {}

const FieldSchema = new Schema<FieldDocument>({
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

export default model<FieldDocument>('Field', FieldSchema)
