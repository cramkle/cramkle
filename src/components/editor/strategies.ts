import { ContentBlock, ContentState } from 'draft-js'

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
      contentState.getEntity(entityKey).getType() === 'mention'
    )
  }, callback)
}
