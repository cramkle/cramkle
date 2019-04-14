import { IResolvers, IResolverObject } from 'graphql-tools'

import { ContentState } from '../../models'

export const root: IResolvers = {
  ContentState: {
    id: root => root._id.toString(),
    entityMap: root => root.entityMap || {},
  },
}

export const mutations: IResolverObject = {
  updateContentState: async (
    _,
    { id: _id, contentState: { blocks, entityMap } },
    { user }
  ) => {
    return ContentState.findOneAndUpdate(
      {
        _id,
        ownerId: user._id,
      },
      { $set: { blocks, entityMap } }
    )
  },
}
