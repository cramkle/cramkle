import { Document, Schema, Types, model as mongooseModel } from 'mongoose'

export interface Model {
  name: string
  ownerId: Types.ObjectId
  primaryFieldId: Types.ObjectId
}

export interface ModelDocument extends Model, Document {}

const ModelSchema = new Schema<ModelDocument>({
  name: String,
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  primaryFieldId: {
    type: Schema.Types.ObjectId,
    ref: 'Field',
  },
})

export default mongooseModel<ModelDocument>('CardModel', ModelSchema)
