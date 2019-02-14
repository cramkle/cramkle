const mongoose = require('mongoose')
const { Schema } = mongoose

const noteSchema = new Schema({
  deckId: {
    type: Schema.Types.ObjectId,
    ref: 'Deck',
  },
  modelId: {
    type: Schema.Types.ObjectId,
    ref: 'CardModel',
  },
  values: [
    {
      type: Schema.Types.ObjectId,
      ref: 'FieldValue',
    },
  ],
  cards: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Card',
    },
  ],
})

const Note = mongoose.model('Note', noteSchema)

module.exports = Note
