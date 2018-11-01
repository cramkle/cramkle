const mongoose = require('mongoose')
const { Schema } = mongoose

const fieldSchema = new Schema({
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

const Field = mongoose.model('Field', fieldSchema)

module.exports = Field
