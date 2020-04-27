import { Document, Schema, Types, model } from 'mongoose'

import { FlashCardStatus } from './Note'

interface RevisionLog {
  interval: number
  lastInterval: number
  timespan: number
  easeFactor: number
  date: Date
  status: FlashCardStatus
  answerQuality: number
  ownerId: Types.ObjectId
  noteId: Types.ObjectId
  flashCardId: Types.ObjectId
}

interface RevisionLogDocument extends Document, RevisionLog {}

const RevisionLogSchema = new Schema<RevisionLogDocument>({
  interval: { type: Number },
  lastInterval: { type: Number },
  timespan: { type: Number },
  easeFactor: { type: Number },
  date: { type: Date },
  status: { type: FlashCardStatus },
  answerQuality: { type: Number },
  ownerId: { type: Types.ObjectId, ref: 'User' },
  noteId: { type: Types.ObjectId, ref: 'Note' },
  flashCardId: { type: Types.ObjectId, ref: 'Card' },
})

export default model<RevisionLogDocument>('RevisionLog', RevisionLogSchema)
