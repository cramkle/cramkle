import { Document, Schema } from 'mongoose'

enum CardStatus {
  NEW = 'NEW',
  LEARNING = 'LEARNING',
  DUE = 'DUE',
}

interface Card {
  active: boolean
  state: CardStatus
  lapses: number
  reviews: number
  interval: number
  easeFactor: number
  due: Date
}

export interface CardDocument extends Document, Card {}

export const CardSchema = new Schema<CardDocument>({
  active: { type: Boolean, default: true },
  state: { type: CardStatus, default: 'NEW' },
  lapses: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  interval: { type: Number },
  easeFactor: { type: Number },
  due: { type: Date },
  templateId: {
    type: Schema.Types.ObjectId,
    ref: 'Template',
  },
  noteId: {
    type: Schema.Types.ObjectId,
    ref: 'Note',
  },
})
