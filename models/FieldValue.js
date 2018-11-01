const mongoose = require('mongoose')
const { Schema } = mongoose

const fieldValueSchema = new Schema({
  data: String,
  fieldId: {
    type: Schema.Types.ObjectId,
    ref: 'Field',
  },
})

const FieldValue = mongoose.model('FieldValue', fieldValueSchema)

module.exports = FieldValue
