import { ContentBlock, ContentState } from 'draft-js'

import { TAG_TYPE } from './constants'

type Callback = (s: number, e: number) => void

export const findTagEntities = (
  contentBlock: ContentBlock,
  callback: Callback,
  contentState: ContentState
) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity()
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === TAG_TYPE
    )
  }, callback)
}
