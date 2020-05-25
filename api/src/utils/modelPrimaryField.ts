import { FieldModel } from '../mongo'
import { ModelDocument } from '../mongo/Model'

export const getModelPrimaryField = async (model: ModelDocument) => {
  const modelFields = await FieldModel.find({ modelId: model._id })

  if (!model.primaryFieldId && !modelFields.length) {
    return null
  }

  if (model.primaryFieldId) {
    return modelFields.find(
      ({ _id }) => model.primaryFieldId === _id.toString()
    )
  }

  return modelFields[0]
}
