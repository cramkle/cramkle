import { Schema, model, Document } from 'mongoose'

interface FieldValue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

interface FieldValueDocument extends FieldValue, Document {}

const FieldValueSchema = new Schema<FieldValueDocument>({
  data: String,
  fieldId: {
    type: Schema.Types.ObjectId,
    ref: 'Field',
  },
})

export default model<FieldValueDocument>('FieldValue', FieldValueSchema)
