import { IResolvers } from 'graphql-tools'

import { ContentStateDocument } from '../mongo/ContentState'
import { encodeGlobalId, globalIdField } from '../utils/graphqlID'

export const root: IResolvers = {
  ContentState: {
    id: globalIdField(),
    entityMap: (root: ContentStateDocument) => {
      const entityMap = root.entityMap || {}

      const updatedEntityMap = Object.entries(entityMap)
        .map(([key, value]) => {
          if (value?.type !== 'TAG') {
            return [key, value] as const
          }

          const encodedFieldId = encodeGlobalId('Field', (value.data as any).id)

          const data = {
            ...value.data,
            id: encodedFieldId,
            name: {
              ...(value.data as any).name,
              id: encodedFieldId,
            },
          }

          return [key, { ...value, data }] as const
        })
        .reduce(
          (obj, [key, value]) => Object.assign({}, obj, { [key]: value }),
          {}
        )

      return updatedEntityMap
    },
  },
}
