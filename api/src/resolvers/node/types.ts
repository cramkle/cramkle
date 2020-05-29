import { fromGlobalId, nodeDefinitions } from 'graphql-relay'
import { Document } from 'mongoose'

import { NoteDocument } from '../../mongo/Note'
import { getConnection } from '../../mongo/connection'

const { nodeInterface, nodeField } = nodeDefinitions(
  async (globalId) => {
    const { type: typeName, id: objectId } = fromGlobalId(globalId)

    const mongoose = await getConnection()

    let document: Document | null

    if (typeName === 'FlashCard') {
      const noteModel = mongoose.model('Note')
      document = ((await noteModel.findOne(
        { 'flashCards._id': objectId },
        { 'flashCards.$': true }
      )) as NoteDocument)?.flashCards.id(objectId)
    } else {
      const documentModel = mongoose.model(typeName)
      document = await documentModel.findById(objectId)
    }

    if (!document) {
      return null
    }

    return { id: globalId, ...document?.toObject?.() }
  },
  (root) => {
    const { type: typeName } = fromGlobalId(root.id)

    return typeName
  }
)

export { nodeInterface, nodeField }
