const mongoose = require('mongoose')
const { Schema } = mongoose

const templateSchema = new Schema({
  name: String,
  frontSide: String,
  backSide: String,
  model: {
    type: Schema.Types.ObjectId,
    ref: 'CardModel',
  },
})

const Template = mongoose.model('Template', templateSchema)

module.exports = Template
