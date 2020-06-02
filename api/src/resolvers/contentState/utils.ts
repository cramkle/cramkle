import { fromGlobalId, toGlobalId } from 'graphql-relay'

import { ContentState } from '../../mongo/ContentState'

export const parseContentStateWithGlobalId = (
  content: ContentState
): ContentState => {
  return {
    ...content,
    entityMap: {
      ...Object.fromEntries(
        Object.entries(content.entityMap).map(([key, value]) => {
          if (value.type === 'TAG') {
            const data = value.data as any
            return [
              key,
              {
                ...value,
                data: {
                  ...data,
                  id: fromGlobalId(data.id).id,
                },
              },
            ]
          }

          return [key, value]
        })
      ),
    },
  }
}

export const encodeEntityMapWithGlobalId = (
  entityMap: ContentState['entityMap']
): ContentState['entityMap'] => {
  return {
    ...Object.fromEntries(
      Object.entries(entityMap).map(([key, value]) => {
        if (value.type === 'TAG') {
          const data = value.data as any
          return [
            key,
            {
              ...value,
              data: {
                ...data,
                id: toGlobalId('Field', data.id),
              },
            },
          ]
        }

        return [key, value]
      })
    ),
  }
}
