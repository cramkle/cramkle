import { Editor, EditorProps, EditorState, DraftHandleValue } from 'draft-js'
import React, { useEffect, useReducer, useCallback, useRef } from 'react'

import MentionsPopup, { MentionableEntry } from './MentionsPopup'
import searchMentions from './searchMentions'

interface Props extends EditorProps {
  mentionSource: MentionableEntry[]
}

interface State {
  mentionableEntries: MentionableEntry[]
  highlightedMentionable: MentionableEntry
  characterOffset: number
}

type Action = { type: 'reset' } | ({ type: 'update' } & State)

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
    case 'reset':
      return initialState
    default:
      return state
  }
}

const MentionsEditor: React.FunctionComponent<Props> = ({
  mentionSource,
  editorState,
  onChange,
  onUpArrow,
  onDownArrow,
  onTab,
  onEscape,
  onBlur,
  handleReturn: handleContentReturn,
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

      let highlighted = highlightedMentionable

      if (!highlighted && mentionables.length) {
        highlighted = mentionables[0]
      }

      dispatch({
        type: 'update',
        highlightedMentionable: highlighted,
        mentionableEntries: mentionables,
        characterOffset: offset,
      })
    },
    [highlightedMentionable]
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

  const handleEscape = (evt: React.KeyboardEvent) => {
    onEscape && onEscape(evt)

    if (mentionableEntries.length) {
      evt.stopPropagation()
      dispatch({ type: 'reset' })
    }
  }

  const handleUpArrow = (evt: React.KeyboardEvent) => {
    if (mentionableEntries.length) {
      evt.preventDefault()
      // TODO: move selection up
    } else {
      onUpArrow && onUpArrow(evt)
    }
  }

  const handleDownArrow = (evt: React.KeyboardEvent) => {
    if (mentionableEntries.length) {
      evt.preventDefault()
      // TODO: move selection down
    } else {
      onDownArrow && onDownArrow(evt)
    }
  }

  const handleBlur = (evt: React.FocusEvent) => {
    dispatch({ type: 'reset' })
    onBlur && onBlur(evt)
  }

  const handleMentionSelect = useCallback(
    (
      mention: MentionableEntry,
      evt: React.KeyboardEvent | React.MouseEvent
    ) => {
      // TODO: add mention
    },
    []
  )

  const handleTab = (evt: React.KeyboardEvent) => {
    if (highlightedMentionable) {
      evt.preventDefault()
      handleMentionSelect(highlightedMentionable, evt)
    } else {
      onTab && onTab(evt)
    }
  }

  const handleReturn = (
    evt: React.KeyboardEvent,
    editorState: EditorState
  ): DraftHandleValue => {
    if (highlightedMentionable) {
      handleMentionSelect(highlightedMentionable, evt)
      return 'handled'
    } else if (handleContentReturn) {
      return handleContentReturn(evt, editorState)
    }
    return 'not-handled'
  }

  return (
    <>
      <Editor
        {...props}
        editorState={editorState}
        onChange={onChange}
        onUpArrow={handleUpArrow}
        onDownArrow={handleDownArrow}
        onTab={handleTab}
        onEscape={handleEscape}
        onBlur={handleBlur}
        handleReturn={handleReturn}
      />
      <MentionsPopup
        mentionableEntries={mentionableEntries}
        selection={editorState.getSelection()}
        onMentionSelect={handleMentionSelect}
        characterOffset={characterOffset}
        highlightedMentionable={highlightedMentionable}
      />
    </>
  )
}

export default MentionsEditor
