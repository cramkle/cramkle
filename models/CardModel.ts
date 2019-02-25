import { Schema, model } from 'mongoose'

const CardModelSchema = new Schema({
  name: String,
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  fields: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Field',
    },
  ],
  templates: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Template',
    },
  ],
})

const CardModel = model('CardModel', CardModelSchema)

export default CardModel
