import { IResolvers } from 'graphql-tools'

import { ContentStateDocument } from '../mongo/ContentState'
import { globalIdField } from '../utils/graphqlID'

export const root: IResolvers = {
  ContentState: {
    id: globalIdField(),
    entityMap: (root: ContentStateDocument) => root.entityMap || {},
  },
}
