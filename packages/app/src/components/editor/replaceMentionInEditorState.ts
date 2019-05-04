import { EditorState, ContentState, Modifier, SelectionState } from 'draft-js'

import { MentionableEntry } from '../../model/MentionableEntry'
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

export default function replaceMentionInEditorState(
  mentionable: MentionableEntry,
  editorState: EditorState,
  offset: number
): EditorState {
  const selection = editorState.getSelection()
  const contentState = editorState.getCurrentContent()

  const anchorOffset = selection.getAnchorOffset()

  const begin = anchorOffset - offset
  const end = anchorOffset

  const textToShow = mentionable.name
  const mentionTextSelection = selection.merge({
    anchorOffset: begin,
    focusOffset: end,
  }) as SelectionState

  const contentStateWithEntity = createMentionEntity(mentionable, contentState)

  const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

  const contentStateWithMention = Modifier.replaceText(
    contentStateWithEntity,
    mentionTextSelection,
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
