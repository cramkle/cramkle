import classnames from 'classnames'
import {
  DraftHandleValue,
  Editor,
  EditorProps,
  EditorState,
  getDefaultKeyBinding,
} from 'draft-js'
import * as KeyCode from 'keycode-js'
import React, { useCallback, useEffect, useReducer, useRef } from 'react'

import { useBaseEditorControls } from './BaseEditorControls'
import { blockStyleFn } from './BlockStyleControls'
import styles from './TagEditor.css'
import { TaggableEntry } from './TaggableEntry'
import TagsPopup from './TagsPopup'
import replaceTagInEditorState from './replaceTagInEditorState'
import searchTags from './searchTags'

interface Props
  extends Omit<
    EditorProps,
    | 'onChange'
    | 'editorState'
    | 'blockStyleFn'
    | 'keyBindingFn'
    | 'handleKeyCommand'
  > {
  tagSource: TaggableEntry[]
  autoHighlight?: boolean
  autoUpdateHighlight?: boolean
}

interface State {
  visibleTagEntries: TaggableEntry[]
  highlightedTag: TaggableEntry | null
  characterOffset: number
}

type Action =
  | { type: 'reset' }
  | ({ type: 'update' } & State)
  | { type: 'update_highlighted'; highlightedTag: TaggableEntry | null }

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
  autoHighlight = true,
  autoUpdateHighlight = true,
  onBlur,
  handleReturn: handleContentReturn,
  ariaAutoComplete = 'list',
  ...props
}) => {
  const baseContext = useBaseEditorControls()

  const {
    editorState,
    onChange,
    handleKeyCommand: baseHandleKeyCommand,
  } = baseContext

  const [
    { highlightedTag, visibleTagEntries, characterOffset },
    dispatch,
  ] = useReducer(reducer, initialState)

  const prevEditorState = useRef(editorState)

  const onShowTags = useCallback(
    (taggables, offset) => {
      if (taggables == null) {
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

  const handleTagHighlight = useCallback((tag: TaggableEntry | null) => {
    dispatch({ type: 'update_highlighted', highlightedTag: tag })
  }, [])

  const moveSelectionUp = () => {
    if (!visibleTagEntries.length) {
      return
    }

    const length = visibleTagEntries.length
    const selectedIndex = highlightedTag
      ? visibleTagEntries.indexOf(highlightedTag)
      : 0

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
    const selectedIndex = highlightedTag
      ? visibleTagEntries.indexOf(highlightedTag)
      : 0

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
    onBlur?.(evt)
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

  const showingTags = !!visibleTagEntries?.length

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

  const handleKeyCommand = (
    command: string,
    editorState: EditorState,
    timestamp: number
  ): DraftHandleValue => {
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
      default: {
        return (
          baseHandleKeyCommand?.(command, editorState, timestamp) ??
          'not-handled'
        )
      }
    }
  }

  const placeholder =
    editorState.getCurrentContent().getBlockMap().first().getType() !==
    'unstyled'
      ? undefined
      : props.placeholder

  return (
    <div className={classnames(styles.editor, 'bg-editor')}>
      <Editor
        {...props}
        placeholder={placeholder}
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
        blockStyleFn={blockStyleFn}
      />
      <TagsPopup
        tagEntries={visibleTagEntries}
        selection={editorState.getSelection()}
        onTagSelect={handleTagSelect}
        onTagHighlight={handleTagHighlight}
        characterOffset={characterOffset}
        highlightedTag={highlightedTag}
      />
    </div>
  )
}

export default TagEditor
