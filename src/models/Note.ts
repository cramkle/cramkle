import { Schema, Types, model, Document } from 'mongoose'

import { CardSchema, CardDocument } from './Card'
import { FieldValueSchema, FieldValueDocument } from './FieldValue'

interface Note {
  cards: Types.DocumentArray<CardDocument>
  values: Types.DocumentArray<FieldValueDocument>
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
  values: [FieldValueSchema],
  cards: [CardSchema],
})

export default model<NoteDocument>('Note', NoteSchema)
