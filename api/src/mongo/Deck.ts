import { Document, Schema, Types, model } from 'mongoose'
import shortid from 'shortid'

export interface Deck {
  title: string
  description?: string
  slug: string
  published: boolean
  ownerId: Types.ObjectId
  notes: Types.Array<Types.ObjectId>
}

export interface DeckDocument extends Deck, Document {}

const DeckSchema = new Schema<DeckDocument>({
  title: {
    type: String,
    required: true,
  },
  description: String,
  slug: {
    type: String,
    unique: true,
  },
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Note',
    },
  ],
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  published: Boolean,
})

DeckSchema.pre('save', function (next) {
  const deck = this as DeckDocument

  if (!deck.isNew) {
    return next()
  }

  deck.slug = shortid.generate()

  next()
})

export default model<DeckDocument>('Deck', DeckSchema)
