import { Editor, EditorProps, EditorState, DraftHandleValue } from 'draft-js'
import React, { useEffect, useState, useCallback } from 'react'

import MentionsPopup, { MentionableEntry } from './MentionsPopup'
import searchMentions from './searchMentions'

interface Props extends EditorProps {
  mentionSource: MentionableEntry[]
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
  const [mentionableEntries, setMentionableEntries] = useState([])
  const [highlightedMentionable, setHighlightedMentionable] = useState(null)
  const [characterOffset, setCharacterOffset] = useState(0)

  const onShowMentions = useCallback(() => {}, [])

  useEffect(() => {
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
      // TODO: reset state
    }
  }

  const handleUpArrow = (evt: React.KeyboardEvent) => {
    if (mentionableEntries.length) {
      evt.preventDefault()
      // TODO
    } else {
      onUpArrow && onUpArrow(evt)
    }
  }

  const handleDownArrow = (evt: React.KeyboardEvent) => {
    if (mentionableEntries.length) {
      evt.preventDefault()
      // TODO
    } else {
      onDownArrow && onDownArrow(evt)
    }
  }

  const handleBlur = (evt: React.FocusEvent) => {
    // TODO: reset state
    onBlur && onBlur(evt)
  }

  const handleMentionSelect = (
    mention: MentionableEntry,
    evt: React.KeyboardEvent
  ) => {
    // TODO: add mention
  }

  const handleTab = (evt: React.KeyboardEvent) => {
    if (mentionableEntries.length) {
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
    if (mentionableEntries.length) {
      // TODO: select mention
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
