import { Document, Schema } from 'mongoose'

import { ContentStateDocument, ContentStateSchema } from './ContentState'

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
