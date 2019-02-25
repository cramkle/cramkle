import { Schema, model } from 'mongoose'

const NoteSchema = new Schema({
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

const Note = model('Note', NoteSchema)

export default Note
