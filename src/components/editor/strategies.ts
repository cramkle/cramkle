import type { ContentBlock, ContentState } from 'draft-js'

import { FUNCTION_TAG_TYPE, TAG_TYPE } from './constants'

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

export const findTextToSpeechEntities = (
  contentBlock: ContentBlock,
  callback: Callback,
  contentState: ContentState
) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity()
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() ===
        FUNCTION_TAG_TYPE.TEXT_TO_SPEECH
    )
  }, callback)
}
