import { Document, Model } from 'mongoose'
import { ObjectId } from 'mongodb'

export function findRefFromList<T extends Document>(
  model: Model<T>,
  refList: (string | ObjectId)[]
) {
  return refList.map((id) => model.findById(id))
}
