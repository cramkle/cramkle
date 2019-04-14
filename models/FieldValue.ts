import { Schema, model, Document } from 'mongoose'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FieldValue {}

interface FieldValueDocument extends FieldValue, Document {}

const FieldValueSchema = new Schema<FieldValueDocument>({
  dataId: {
    type: Schema.Types.ObjectId,
    ref: 'ContentState',
  },
  fieldId: {
    type: Schema.Types.ObjectId,
    ref: 'Field',
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

export default model<FieldValueDocument>('FieldValue', FieldValueSchema)
