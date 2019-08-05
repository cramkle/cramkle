import {
  DraftHandleValue,
  Editor,
  EditorProps,
  EditorState,
  getDefaultKeyBinding,
} from 'draft-js'
import * as KeyCode from 'keycode-js'
import React, { useCallback, useEffect, useReducer, useRef } from 'react'

import TagsPopup from './TagsPopup'
import searchTags from './searchTags'
import replaceTagInEditorState from './replaceTagInEditorState'
import { TaggableEntry } from './TaggableEntry'

interface Props extends Omit<EditorProps, 'keyBindingFn' | 'handleKeyCommand'> {
  tagSource: TaggableEntry[]
  autoHighlight?: boolean
  autoUpdateHighlight?: boolean
}

interface State {
  visibleTagEntries: TaggableEntry[]
  highlightedTag: TaggableEntry
  characterOffset: number
}

type Action =
  | { type: 'reset' }
  | ({ type: 'update' } & State)
  | { type: 'update_highlighted'; highlightedTag: TaggableEntry }

const initialState: State = {
  visibleTagEntries: [],
  highlightedTag: null,
  characterOffset: 0,
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'update':
      return {
        highlightedTag: action.highlightedTag,
        visibleTagEntries: action.visibleTagEntries,
        characterOffset: action.characterOffset,
      }
    case 'update_highlighted':
      return { ...state, highlightedTag: action.highlightedTag }
    case 'reset':
      return initialState
    default:
      return state
  }
}

const TagEditor: React.FunctionComponent<Props> = ({
  tagSource,
  editorState,
  autoHighlight = true,
  autoUpdateHighlight = true,
  onChange,
  onBlur,
  handleReturn: handleContentReturn,
  ariaAutoComplete = 'list',
  ...props
}) => {
  const [
    { highlightedTag, visibleTagEntries, characterOffset },
    dispatch,
  ] = useReducer(reducer, initialState)

  const prevEditorState = useRef(editorState)

  const onShowTags = useCallback(
    (taggables, offset) => {
      if (taggables === null) {
        dispatch({ type: 'reset' })
        return
      }

      let highlighted = null

      if (!highlightedTag || autoHighlight) {
        if (autoUpdateHighlight) {
          highlighted = taggables[0]
        } else {
          highlighted = highlightedTag
        }
      }

      dispatch({
        type: 'update',
        highlightedTag: highlighted,
        visibleTagEntries: taggables,
        characterOffset: offset,
      })
    },
    [autoHighlight, autoUpdateHighlight, highlightedTag]
  )

  useEffect(() => {
    if (prevEditorState.current === editorState) {
      return
    }

    prevEditorState.current = editorState

    const selection = editorState.getSelection()

    if (!selection.isCollapsed() || !selection.getHasFocus()) {
      return
    }

    const contentState = editorState.getCurrentContent()

    searchTags(tagSource, selection, contentState, onShowTags)
  }, [editorState, tagSource, onShowTags])

  const handleTagHighlight = useCallback((tag: TaggableEntry) => {
    dispatch({ type: 'update_highlighted', highlightedTag: tag })
  }, [])

  const moveSelectionUp = () => {
    if (!visibleTagEntries.length) {
      return
    }

    const length = visibleTagEntries.length
    const selectedIndex = visibleTagEntries.indexOf(highlightedTag)

    let highlighted = null

    if (!highlightedTag) {
      highlighted = visibleTagEntries[length - 1]
    } else if (selectedIndex > 0) {
      highlighted = visibleTagEntries[selectedIndex - 1]
    }

    handleTagHighlight(highlighted)
  }

  const moveSelectionDown = () => {
    if (!visibleTagEntries.length) {
      return
    }

    const length = visibleTagEntries.length
    const selectedIndex = visibleTagEntries.indexOf(highlightedTag)

    let highlighted = null

    if (!highlightedTag) {
      highlighted = visibleTagEntries[0]
    } else if (selectedIndex < length - 1) {
      highlighted = visibleTagEntries[selectedIndex + 1]
    }

    handleTagHighlight(highlighted)
  }

  const handleBlur = (evt: React.FocusEvent) => {
    dispatch({ type: 'reset' })
    onBlur && onBlur(evt)
  }

  const handleTagSelect = useCallback(
    (tag: TaggableEntry) => {
      const editorWithTags = replaceTagInEditorState(
        tag,
        editorState,
        characterOffset
      )

      onChange(editorWithTags)
      dispatch({ type: 'reset' })
    },
    [characterOffset, editorState, onChange]
  )

  const handleReturn = (
    evt: React.KeyboardEvent,
    editorState: EditorState
  ): DraftHandleValue => {
    if (highlightedTag) {
      handleTagSelect(highlightedTag)
      return 'handled'
    } else if (handleContentReturn) {
      return handleContentReturn(evt, editorState)
    }
    return 'not-handled'
  }

  const showingTags = !!(visibleTagEntries && visibleTagEntries.length)

  const keyBinder = (e: React.KeyboardEvent) => {
    if (showingTags) {
      if (e.keyCode === KeyCode.KEY_TAB) {
        return 'handle-autocomplete'
      } else if (e.keyCode === KeyCode.KEY_ESCAPE) {
        return 'cancel-autocomplete'
      } else if (e.keyCode === KeyCode.KEY_UP) {
        return 'move-selection-up'
      } else if (e.keyCode === KeyCode.KEY_DOWN) {
        return 'move-selection-down'
      }
    }

    return getDefaultKeyBinding(e)
  }

  const handleKeyCommand = (command: string): DraftHandleValue => {
    switch (command) {
      case 'handle-autocomplete':
        if (highlightedTag) {
          handleTagSelect(highlightedTag)
        }

        return 'handled'
      case 'cancel-autocomplete':
        if (visibleTagEntries.length) {
          dispatch({ type: 'reset' })
        }
        return 'handled'
      case 'move-selection-up':
        moveSelectionUp()
        return 'handled'
      case 'move-selection-down':
        moveSelectionDown()
        return 'handled'
      default:
        return 'not-handled'
    }
  }

  return (
    <>
      <Editor
        {...props}
        ariaAutoComplete={ariaAutoComplete}
        ariaExpanded={showingTags}
        role="combobox"
        spellCheck
        editorState={editorState}
        onChange={onChange}
        onBlur={handleBlur}
        handleReturn={handleReturn}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={keyBinder}
      />
      <TagsPopup
        tagEntries={visibleTagEntries}
        selection={editorState.getSelection()}
        onTagSelect={handleTagSelect}
        onTagHighlight={handleTagHighlight}
        characterOffset={characterOffset}
        highlightedTag={highlightedTag}
      />
    </>
  )
}

export default TagEditor
