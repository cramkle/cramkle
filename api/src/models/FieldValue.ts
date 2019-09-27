import { Schema, Document } from 'mongoose'

import { ContentStateSchema, ContentStateDocument } from './ContentState'

interface FieldValue {
  data: ContentStateDocument
}

export interface FieldValueDocument extends FieldValue, Document {}

export const FieldValueSchema = new Schema<FieldValueDocument>({
  data: ContentStateSchema,
  fieldId: {
    type: Schema.Types.ObjectId,
    ref: 'Field',
  },
})
