import {
  ContentState,
  Editor as DraftEditor,
  DraftEditorCommand,
  EditorProps,
  EditorState,
  RawDraftContentState,
  RichUtils,
  convertFromRaw,
} from 'draft-js'
import 'draft-js/dist/Draft.css'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { TabController } from 'react-tab-controller'

import Card, { CardActionButtons, CardActions } from '../views/Card'
import BlockStyleControls, { blockStyleFn } from './BlockStyleControls'
import InlineStyleControls from './InlineStyleControls'

interface Props
  extends Omit<EditorProps, 'onChange' | 'editorState' | 'blockStyleFn'> {
  className?: string
  initialContentState?: any
  onChange?: (content: ContentState) => void
  Editor?: React.ComponentType<EditorProps>
}

const BaseEditor: React.FC<Props> = ({
  Editor = DraftEditor,
  className,
  onChange,
  initialContentState,
  handleKeyCommand,
  ...props
}) => {
  const [editor, setEditor] = useState(() => {
    if (!initialContentState || initialContentState.blocks.length === 0) {
      return EditorState.createEmpty()
    }

    const contentState = convertFromRaw(
      initialContentState as RawDraftContentState
    )

    return EditorState.createWithContent(contentState)
  })

  const contentState = editor.getCurrentContent()
  const prevContentState = useRef(contentState)

  useEffect(() => {
    if (contentState === prevContentState.current) {
      return
    }

    prevContentState.current = contentState
    onChange?.(contentState)
  }, [onChange, contentState])

  const handleStyleToggle = useCallback(
    (style: string) => {
      setEditor(RichUtils.toggleInlineStyle(editor, style))
    },
    [editor]
  )

  const handleBlockStyleToggle = useCallback(
    (style: string | ContentState) => {
      if (typeof style === 'string') {
        setEditor(RichUtils.toggleBlockType(editor, style))
      } else {
        setEditor(EditorState.push(editor, style, 'change-block-data'))
      }
    },
    [editor]
  )

  const baseHandleKeyCommand = useCallback(
    (
      command: DraftEditorCommand,
      editorState: EditorState,
      timestamp: number
    ) => {
      const updatedState = RichUtils.handleKeyCommand(editorState, command)

      if (updatedState) {
        setEditor(updatedState)
        return 'handled'
      }

      return (
        handleKeyCommand?.(command, editorState, timestamp) ?? 'not-handled'
      )
    },
    [handleKeyCommand]
  )

  return (
    <Card outlined className={className}>
      <CardActions className="border-b border-outline">
        <CardActionButtons className="flex-col items-start">
          <TabController>
            <BlockStyleControls
              editor={editor}
              onToggle={handleBlockStyleToggle}
            />
          </TabController>
          <TabController>
            <InlineStyleControls editor={editor} onToggle={handleStyleToggle} />
          </TabController>
        </CardActionButtons>
      </CardActions>
      <div className="p-4">
        <Editor
          editorState={editor}
          onChange={setEditor}
          blockStyleFn={blockStyleFn}
          handleKeyCommand={baseHandleKeyCommand}
          {...props}
        />
      </div>
    </Card>
  )
}

export default BaseEditor
