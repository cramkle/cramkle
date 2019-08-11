import { Schema, Types, model, Document } from 'mongoose'

import { CardSchema, CardDocument } from './Card'

interface Note {
  cards: Types.DocumentArray<CardDocument>
}

interface NoteDocument extends Note, Document {}

const NoteSchema = new Schema<NoteDocument>({
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
  cards: [CardSchema],
})

export default model<NoteDocument>('Note', NoteSchema)
