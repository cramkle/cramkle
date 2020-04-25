import { IResolverObject, IResolvers } from 'graphql-tools'

import { getConnection } from '../mongo/connection'
import { decodeModelId } from '../utils/graphqlID'

export const root: IResolvers = {
  Node: {
    __resolveType: (root: { id: string }) => {
      const [typeName] = decodeModelId(root.id)

      return typeName
    },
  },
}

export const resolvers: IResolverObject = {
  node: async (_: unknown, { id }: { id: string }) => {
    const [typeName, objectId] = decodeModelId(id)

    const mongoose = await getConnection()

    const documentModel = mongoose.model(typeName)
    const document = await documentModel.findById(objectId)

    if (!document) {
      return null
    }

    return { id, ...document?.toObject?.() }
  },
}
