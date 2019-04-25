import { EditorState, ContentState, Modifier, SelectionState } from 'draft-js'

import { MentionableEntry } from './MentionsPopup'
import { MENTION_TYPE } from './constants'

const createMentionEntity = (
  mentionable: MentionableEntry,
  contentState: ContentState
) => {
  return contentState.createEntity(MENTION_TYPE, 'IMMUTABLE', {
    id: mentionable.id,
    name: mentionable,
  })
}

const findOffset = (a: string, b: string, initialOffset: number) => {
  let offset = initialOffset

  for (let i = offset; i <= b.length; i++) {
    if (a.substr(-i) === b.substr(0, i)) {
      offset = i
    }
  }

  return offset
}

export default function replaceMentionInEditorState(
  mentionable: MentionableEntry,
  editorState: EditorState,
  offset: number
): EditorState {
  const selection = editorState.getSelection()
  const contentState = editorState.getCurrentContent()
  const anchorKey = selection.getAnchorKey()
  const anchorOffset = selection.getAnchorOffset()

  const block = contentState.getBlockMap().get(anchorKey)
  const startOffset = selection.getStartOffset()
  const textToReplace = block.getText().substr(startOffset - offset, offset)

  const textToShow = mentionable.name
  const newStart =
    anchorOffset -
    findOffset(block.getText().substr(0, anchorOffset), textToReplace, offset)

  const contentStateWithEntity = createMentionEntity(mentionable, contentState)

  const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

  const contentStateWithMention = Modifier.replaceText(
    contentStateWithEntity,
    selection.merge({ anchorOffset: newStart }) as SelectionState,
    textToShow,
    editorState.getCurrentInlineStyle(),
    entityKey
  )

  return EditorState.push(
    editorState,
    contentStateWithMention,
    'insert-fragment'
  )
}
