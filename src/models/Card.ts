import { Document, Schema, model } from 'mongoose'

interface Card {
  active: boolean
}

interface CardDocument extends Document, Card {}

const CardSchema = new Schema<CardDocument>({
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

export default model<CardDocument>('Card', CardSchema)
