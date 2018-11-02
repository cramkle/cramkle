const mongoose = require('mongoose')
const shortid = require('shortid')
const { Schema } = mongoose

const deckSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  slug: {
    type: String,
    unique: true,
  },
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note',
  }],
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  published: Boolean,
})

deckSchema.pre('save', function(next) {
  const deck = this

  if (!deck.isNew) {
    return next()
  }

  deck.slug = shortid.generate()

  next()
})

const Deck = mongoose.model('Deck', deckSchema)

module.exports = Deck
