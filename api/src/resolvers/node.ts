import { IResolverObject, IResolvers } from 'graphql-tools'

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

    const documentModel = mongoose.model(typeName)
    const document = await documentModel.findById(objectId)

    if (!document) {
      return null
    }

    return { id, ...document?.toObject?.() }
  },
}
