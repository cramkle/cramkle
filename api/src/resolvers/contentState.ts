import { IResolvers } from 'graphql-tools'

export const root: IResolvers = {
  ContentState: {
    id: (root) => root._id.toString(),
    entityMap: (root) => root.entityMap || {},
  },
}
