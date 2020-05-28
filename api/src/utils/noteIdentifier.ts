import { convertFromRaw } from 'draft-js'

import { ModelModel } from '../mongo'
import { NoteDocument } from '../mongo/Note'
import { getModelPrimaryField } from './modelPrimaryField'

export const getNoteIdentifier = async (
  note: NoteDocument
): Promise<string> => {
  const noteModel = await ModelModel.findById(note.modelId)

  const modelPrimaryField = await getModelPrimaryField(noteModel!)

  const primaryFieldValue = note.values.find((value) =>
    value.fieldId.equals(modelPrimaryField?._id)
  )

  if (!primaryFieldValue) {
    return note.id
  }

  const contentState = convertFromRaw({
    entityMap: {},
    ...primaryFieldValue.data.toJSON(),
  })

  return contentState.getPlainText()
}
