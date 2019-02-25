import { Schema, model } from 'mongoose'

const CardSchema = new Schema({
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

const Card = model('Card', CardSchema)

export default Card
