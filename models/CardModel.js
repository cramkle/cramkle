const mongoose = require('mongoose')
const { Schema } = mongoose

const cardModelSchema = new Schema({
  name: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  fields: [{
    type: Schema.Types.ObjectId,
    ref: 'Field',
  }],
  templates: [{
    type: Schema.Types.ObjectId,
    ref: 'Template',
  }],
})

const CardModel = mongoose.model('CardModel', cardModelSchema)

module.exports = CardModel

