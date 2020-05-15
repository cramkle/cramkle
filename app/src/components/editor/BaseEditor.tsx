import { Editor, EditorProps } from 'draft-js'
import 'draft-js/dist/Draft.css'
import React from 'react'

import { useBaseEditorControls } from './BaseEditorControls'
import { blockStyleFn } from './BlockStyleControls'

type Props = Omit<
  EditorProps,
  'onChange' | 'editorState' | 'blockStyleFn' | 'handleKeyCommand'
>

const BaseEditor: React.FC<Props> = (props) => {
  const baseContext = useBaseEditorControls()

  return (
    <Editor
      {...props}
      editorState={baseContext?.editorState}
      onChange={baseContext?.onChange}
      blockStyleFn={blockStyleFn}
      handleKeyCommand={baseContext?.handleKeyCommand}
    />
  )
}

export default BaseEditor
