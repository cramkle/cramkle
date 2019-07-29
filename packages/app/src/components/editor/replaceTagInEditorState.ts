import { EditorState, ContentState, Modifier, SelectionState } from 'draft-js'

import { TaggableEntry } from './TaggableEntry'
import { TAG_TYPE } from './constants'

const createTagEntity = (
  taggable: TaggableEntry,
  contentState: ContentState
) => {
  return contentState.createEntity(TAG_TYPE, 'IMMUTABLE', {
    id: taggable.id,
    name: taggable,
  })
}

export default function replaceTagInEditorState(
  taggable: TaggableEntry,
  editorState: EditorState,
  offset: number
): EditorState {
  const selection = editorState.getSelection()
  const contentState = editorState.getCurrentContent()

  const anchorOffset = selection.getAnchorOffset()

  const begin = anchorOffset - offset
  const end = anchorOffset

  const textToShow = taggable.name
  const tagTextSelection = selection.merge({
    anchorOffset: begin,
    focusOffset: end,
  }) as SelectionState

  const contentStateWithEntity = createTagEntity(taggable, contentState)

  const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

  const contentStateWithTag = Modifier.replaceText(
    contentStateWithEntity,
    tagTextSelection,
    textToShow,
    editorState.getCurrentInlineStyle(),
    entityKey
  )

  return EditorState.push(editorState, contentStateWithTag, 'insert-fragment')
}
