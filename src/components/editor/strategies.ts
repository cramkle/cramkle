import { ContentBlock, ContentState } from 'draft-js'
import FIELD_REGEXP from './fieldRegExp'

type Callback = (s: number, e: number) => void

export const findFieldEntities = (
  contentBlock: ContentBlock,
  callback: Callback,
  contentState: ContentState
) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity()
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'field'
    )
  }, callback)
}

export const findFieldSuggestions = (
  contentBlock: ContentBlock,
  callback: Callback
) => {
  const regex = new RegExp(`@(${FIELD_REGEXP}|\\s){0,}`, 'g')
  const contentBlockText = contentBlock.getText()

  // exclude entities, when matching
  contentBlock.findEntityRanges(
    character => !character.getEntity(),
    (nonEntityStart, nonEntityEnd) => {
      const text = contentBlockText.slice(nonEntityStart, nonEntityEnd)
      let matchArr
      let start
      let prevLastIndex = regex.lastIndex

      // Go through all matches in the text and return the indices to the callback
      // Break the loop if lastIndex is not changed
      while ((matchArr = regex.exec(text)) !== null) { // eslint-disable-line
        if (regex.lastIndex === prevLastIndex) {
          break
        }
        prevLastIndex = regex.lastIndex
        start = nonEntityStart + matchArr.index
        callback(start, start + matchArr[0].length)
      }
    }
  )
}
