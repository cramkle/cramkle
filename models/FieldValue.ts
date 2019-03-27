import { Schema, model, Document } from 'mongoose'

import { Block } from './Block'

interface FieldValue {
  data: Block[]
}

interface FieldValueDocument extends FieldValue, Document {}

const FieldValueSchema = new Schema<FieldValueDocument>({
  data: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Block',
    },
  ],
  fieldId: {
    type: Schema.Types.ObjectId,
    ref: 'Field',
  },
})

export default model<FieldValueDocument>('FieldValue', FieldValueSchema)
