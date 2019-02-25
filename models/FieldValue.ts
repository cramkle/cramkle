import { Schema, model } from 'mongoose'

const FieldValueSchema = new Schema({
  data: String,
  fieldId: {
    type: Schema.Types.ObjectId,
    ref: 'Field',
  },
})

const FieldValue = model('FieldValue', FieldValueSchema)

export default FieldValue
