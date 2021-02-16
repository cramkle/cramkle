import classnames from 'classnames'
import type {
  CompositeDecorator,
  ContentState,
  DraftEditorCommand,
  EditorProps,
  RawDraftContentState,
} from 'draft-js'
import { EditorState, RichUtils, convertFromRaw } from 'draft-js'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import * as React from 'react'
import { TabController } from 'react-tab-controller'

import BlockStyleControls from './BlockStyleControls'
import InlineStyleControls from './InlineStyleControls'

type BaseEditorContext = Pick<
  EditorProps,
  'onChange' | 'editorState' | 'handleKeyCommand'
>

const ctx = createContext<undefined | BaseEditorContext>(undefined)

export const useBaseEditorControls = () => {
  const contextValue = useContext(ctx)

  if (!contextValue) {
    throw new Error(
      'useBaseEditorControls must be used inside <BaseEditorControls />'
    )
  }

  return contextValue
}

interface Props extends Pick<EditorProps, 'handleKeyCommand'> {
  initialContentState?: RawDraftContentState
  onChange?: (content: ContentState) => void
  className?: string
  decorators?: CompositeDecorator
}

const BaseEditorControls: React.FC<Props> = ({
  className,
  initialContentState,
  onChange,
  handleKeyCommand,
  decorators,
  children,
}) => {
  const [editor, setEditor] = useState(() => {
    if (!initialContentState || initialContentState.blocks.length === 0) {
      return EditorState.createEmpty(decorators)
    }

    const contentState = convertFromRaw(
      initialContentState as RawDraftContentState
    )

    return EditorState.createWithContent(contentState, decorators)
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

  const contextValue = useMemo(
    () => ({
      handleKeyCommand: baseHandleKeyCommand,
      editorState: editor,
      onChange: setEditor,
    }),
    [baseHandleKeyCommand, editor]
  )

  return (
    <ctx.Provider value={contextValue}>
      <div
        className={classnames(
          className,
          'bg-editor text-on-surface rounded-xl shadow p-0 overflow-hidden'
        )}
      >
        <div className="flex items-center p-2 border-b border-divider border-opacity-divider">
          <div className="w-full flex flex-col items-start">
            <TabController>
              <BlockStyleControls
                editor={editor}
                onToggle={handleBlockStyleToggle}
              />
            </TabController>
            <TabController>
              <InlineStyleControls
                editor={editor}
                onToggle={handleStyleToggle}
              />
            </TabController>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </ctx.Provider>
  )
}

export default BaseEditorControls
