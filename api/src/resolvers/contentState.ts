import { IResolvers } from 'graphql-tools'
import { ContentStateDocument } from '../models/ContentState'

export const root: IResolvers = {
  ContentState: {
    id: (root: ContentStateDocument) => root._id.toString(),
    entityMap: (root: ContentStateDocument) => root.entityMap || {},
  },
}
