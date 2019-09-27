import { Document, Model } from 'mongoose'

export function findRefFromList<T extends Document>(
  model: Model<T>,
  refList: string[]
) {
  return refList.map(id => model.findById(id))
}
