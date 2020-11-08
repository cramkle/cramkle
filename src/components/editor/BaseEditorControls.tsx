import classnames from 'classnames'
import type {
  ContentState,
  DraftDecorator,
  DraftEditorCommand,
  EditorProps,
  RawDraftContentState,
} from 'draft-js'
import {
  CompositeDecorator,
  EditorState,
  RichUtils,
  convertFromRaw,
} from 'draft-js'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as React from 'react'
import { TabController } from 'react-tab-controller'

import { BaseEditorContextProvider } from './BaseEditorContext'
import BlockStyleControls from './BlockStyleControls'
import { linkDecorator } from './EditorLink'
import InlineStylePopup from './InlineStylePopup'

interface Props extends Pick<EditorProps, 'handleKeyCommand'> {
  initialContentState?: RawDraftContentState
  onChange?: (content: ContentState) => void
  className?: string
  decorators?: DraftDecorator[]
}

const BaseEditorControls: React.FC<Props> = ({
  className,
  initialContentState,
  onChange,
  handleKeyCommand,
  decorators: decoratorsProps = [],
  children,
}) => {
  const decorators = useMemo(() => [...decoratorsProps, linkDecorator], [
    decoratorsProps,
  ])

  const [editor, setEditor] = useState(() => {
    if (!initialContentState || initialContentState.blocks.length === 0) {
      return EditorState.createEmpty(new CompositeDecorator(decorators))
    }

    const contentState = convertFromRaw(
      initialContentState as RawDraftContentState
    )

    return EditorState.createWithContent(
      contentState,
      new CompositeDecorator(decorators)
    )
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

  const contextValue = useMemo(
    () => ({
      handleKeyCommand: baseHandleKeyCommand,
      editorState: editor,
      onChange: setEditor,
    }),
    [baseHandleKeyCommand, editor]
  )

  const rootRef = useRef<HTMLDivElement>(null)

  return (
    <BaseEditorContextProvider value={contextValue}>
      <div
        className={classnames(
          className,
          'relative bg-editor text-on-surface rounded-xl p-0'
        )}
        ref={rootRef}
      >
        <div className="flex items-center p-2 border-b border-divider border-opacity-divider overflow-hidden">
          <div className="w-full flex flex-col items-start">
            <TabController>
              <BlockStyleControls
                editor={editor}
                onToggle={handleBlockStyleToggle}
              />
            </TabController>
          </div>
        </div>
        <InlineStylePopup selection={editor.getSelection()} rootRef={rootRef} />
        <div>{children}</div>
      </div>
    </BaseEditorContextProvider>
  )
}

export default BaseEditorControls
