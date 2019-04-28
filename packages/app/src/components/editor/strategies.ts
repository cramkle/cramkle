import { ContentBlock, ContentState } from 'draft-js'

import { MENTION_TYPE } from './constants'

type Callback = (s: number, e: number) => void

export const findMentionEntities = (
  contentBlock: ContentBlock,
  callback: Callback,
  contentState: ContentState
) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity()
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === MENTION_TYPE
    )
  }, callback)
}
