import { IResolverObject, IResolvers } from 'graphql-tools'
import { Document } from 'mongoose'

import { NoteDocument } from '../mongo/Note'
import { getConnection } from '../mongo/connection'
import { decodeGlobalId } from '../utils/graphqlID'

export const root: IResolvers = {
  Node: {
    __resolveType: (root: { id: string }) => {
      const { typeName } = decodeGlobalId(root.id)

      return typeName
    },
  },
}

export const resolvers: IResolverObject = {
  node: async (_: unknown, { id }: { id: string }) => {
    const { typeName, objectId } = decodeGlobalId(id)

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

    return { id, ...document?.toObject?.() }
  },
}
