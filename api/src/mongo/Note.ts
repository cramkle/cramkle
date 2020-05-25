import { Document, Schema, Types, model } from 'mongoose'

import { ContentStateDocument, ContentStateSchema } from './ContentState'

// -----------
// Field values
interface FieldValue {
  data: ContentStateDocument
  fieldId: Types.ObjectId
}

export interface FieldValueDocument extends FieldValue, Document {}

export const FieldValueSchema = new Schema<FieldValueDocument>({
  data: ContentStateSchema,
  fieldId: {
    type: Schema.Types.ObjectId,
    ref: 'Field',
  },
})

// ----------
// Flash cards
export enum FlashCardStatus {
  NEW = 'NEW',
  LEARNING = 'LEARNING',
  REVIEW = 'REVIEW',
}

export interface FlashCard {
  active: boolean
  /**
   * @deprecated Use `status` instead
   */
  state: FlashCardStatus
  status: FlashCardStatus
  lapses: number
  reviews: number
  interval: number
  easeFactor: number
  due: Date
  templateId: Types.ObjectId
  noteId: Types.ObjectId
}

export interface FlashCardDocument extends Document, FlashCard {}

export const FlashCardSchema = new Schema<FlashCardDocument>({
  active: { type: Boolean, default: true },
  status: { type: FlashCardStatus, default: 'NEW' },
  lapses: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  interval: { type: Number },
  easeFactor: { type: Number, default: 2.5 },
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

// ----------
// Note
export interface Note {
  flashCards: Types.DocumentArray<FlashCardDocument>
  values: Types.DocumentArray<FieldValueDocument>
  deckId: Types.ObjectId
  modelId: Types.ObjectId
  ownerId: Types.ObjectId
}

export interface NoteDocument extends Note, Document {}

const NoteSchema = new Schema<NoteDocument>({
  deckId: {
    type: Schema.Types.ObjectId,
    ref: 'Deck',
  },
  modelId: {
    type: Schema.Types.ObjectId,
    ref: 'Model',
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  values: [FieldValueSchema],
  flashCards: [FlashCardSchema],
})

NoteSchema.index({ 'values.data.blocks.text': 'text' })

export default model<NoteDocument>('Note', NoteSchema)
