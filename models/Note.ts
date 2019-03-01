import { Schema, model, Document } from 'mongoose'

// eslint-disable-next-line
interface Note {}

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
  cards: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Card',
    },
  ],
})

export default model<NoteDocument>('Note', NoteSchema)
