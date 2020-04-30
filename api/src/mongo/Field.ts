import { Document, Schema, Types, model } from 'mongoose'

export interface Field {
  name: string
  modelId: Types.ObjectId
}

export interface FieldDocument extends Field, Document {}

const FieldSchema = new Schema<FieldDocument>({
  name: { type: String, required: true },
  modelId: {
    type: Schema.Types.ObjectId,
    ref: 'Model',
  },
})

export default model<FieldDocument>('Field', FieldSchema)
