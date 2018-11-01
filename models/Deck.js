const mongoose = require('mongoose')
const { Schema } = mongoose

const deckSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note',
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  published: Boolean,
})

const Deck = mongoose.model('Deck', deckSchema)

module.exports = Deck
