const mongoose = require('mongoose')
const { Schema } = mongoose

const cardSchema = new Schema({
  active: Boolean,
  templateId: {
    type: Schema.Types.ObjectId,
    ref: 'Template',
  },
  noteId: {
    type: Schema.Types.ObjectId,
    ref: 'Note',
  },
})

const Card = mongoose.model('Card', cardSchema)

module.exports = Card
