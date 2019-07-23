import {
  Editor,
  EditorProps,
  EditorState,
  DraftHandleValue,
  getDefaultKeyBinding,
} from 'draft-js'
import * as KeyCode from 'keycode-js'
import React, { useEffect, useReducer, useCallback, useRef } from 'react'

import MentionsPopup from './MentionsPopup'
import searchMentions from './searchMentions'
import replaceMentionInEditorState from './replaceMentionInEditorState'
import { MentionableEntry } from '../../model/MentionableEntry'

interface Props extends Omit<EditorProps, 'keyBindingFn' | 'handleKeyCommand'> {
  mentionSource: MentionableEntry[]
  autoHighlight?: boolean
  autoUpdateHighlight?: boolean
}

interface State {
  mentionableEntries: MentionableEntry[]
  highlightedMentionable: MentionableEntry
  characterOffset: number
}

type Action =
  | { type: 'reset' }
  | ({ type: 'update' } & State)
  | { type: 'update_highlighted'; highlightedMentionable: MentionableEntry }

const initialState: State = {
  mentionableEntries: [],
  highlightedMentionable: null,
  characterOffset: 0,
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'update':
      return {
        highlightedMentionable: action.highlightedMentionable,
        mentionableEntries: action.mentionableEntries,
        characterOffset: action.characterOffset,
      }
    case 'update_highlighted':
      return { ...state, highlightedMentionable: action.highlightedMentionable }
    case 'reset':
      return initialState
    default:
      return state
  }
}

const MentionsEditor: React.FunctionComponent<Props> = ({
  mentionSource,
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
    { highlightedMentionable, mentionableEntries, characterOffset },
    dispatch,
  ] = useReducer(reducer, initialState)

  const prevEditorState = useRef(editorState)

  const onShowMentions = useCallback(
    (mentionables, offset) => {
      if (mentionables === null) {
        dispatch({ type: 'reset' })
        return
      }

      let highlighted = null

      if (!highlightedMentionable || autoHighlight) {
        if (autoUpdateHighlight) {
          highlighted = mentionables[0]
        } else {
          highlighted = highlightedMentionable
        }
      }

      dispatch({
        type: 'update',
        highlightedMentionable: highlighted,
        mentionableEntries: mentionables,
        characterOffset: offset,
      })
    },
    [autoHighlight, autoUpdateHighlight, highlightedMentionable]
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

    searchMentions(mentionSource, selection, contentState, onShowMentions)
  }, [editorState, mentionSource, onShowMentions])

  const handleMentionHighlight = useCallback((mention: MentionableEntry) => {
    dispatch({ type: 'update_highlighted', highlightedMentionable: mention })
  }, [])

  const moveSelectionUp = () => {
    if (!mentionableEntries.length) {
      return
    }

    const length = mentionableEntries.length
    const selectedIndex = mentionableEntries.indexOf(highlightedMentionable)

    let highlighted = null

    if (!highlightedMentionable) {
      highlighted = mentionableEntries[length - 1]
    } else if (selectedIndex > 0) {
      highlighted = mentionableEntries[selectedIndex - 1]
    }

    handleMentionHighlight(highlighted)
  }

  const moveSelectionDown = () => {
    if (!mentionableEntries.length) {
      return
    }

    const length = mentionableEntries.length
    const selectedIndex = mentionableEntries.indexOf(highlightedMentionable)

    let highlighted = null

    if (!highlightedMentionable) {
      highlighted = mentionableEntries[0]
    } else if (selectedIndex < length - 1) {
      highlighted = mentionableEntries[selectedIndex + 1]
    }

    handleMentionHighlight(highlighted)
  }

  const handleBlur = (evt: React.FocusEvent) => {
    dispatch({ type: 'reset' })
    onBlur && onBlur(evt)
  }

  const handleMentionSelect = useCallback(
    (mention: MentionableEntry) => {
      const editorWithMention = replaceMentionInEditorState(
        mention,
        editorState,
        characterOffset
      )

      onChange(editorWithMention)
      dispatch({ type: 'reset' })
    },
    [characterOffset, editorState, onChange]
  )

  const handleReturn = (
    evt: React.KeyboardEvent,
    editorState: EditorState
  ): DraftHandleValue => {
    if (highlightedMentionable) {
      handleMentionSelect(highlightedMentionable)
      return 'handled'
    } else if (handleContentReturn) {
      return handleContentReturn(evt, editorState)
    }
    return 'not-handled'
  }

  const showingMentions = !!(mentionableEntries && mentionableEntries.length)

  const keyBinder = (e: React.KeyboardEvent) => {
    if (showingMentions) {
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
        if (highlightedMentionable) {
          handleMentionSelect(highlightedMentionable)
        }

        return 'handled'
      case 'cancel-autocomplete':
        if (mentionableEntries.length) {
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
        ariaExpanded={showingMentions}
        role="combobox"
        spellCheck
        editorState={editorState}
        onChange={onChange}
        onBlur={handleBlur}
        handleReturn={handleReturn}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={keyBinder}
      />
      <MentionsPopup
        mentionableEntries={mentionableEntries}
        selection={editorState.getSelection()}
        onMentionSelect={handleMentionSelect}
        onMentionHighlight={handleMentionHighlight}
        characterOffset={characterOffset}
        highlightedMentionable={highlightedMentionable}
      />
    </>
  )
}

export default MentionsEditor
