import { Editor, EditorProps } from 'draft-js'
import 'draft-js/dist/Draft.css'
import React from 'react'

import styles from './BaseEditor.css'
import { useBaseEditorControls } from './BaseEditorControls'
import { blockStyleFn } from './BlockStyleControls'

type Props = Omit<
  EditorProps,
  'onChange' | 'editorState' | 'blockStyleFn' | 'handleKeyCommand'
>

const BaseEditor: React.FC<Props> = (props) => {
  const baseContext = useBaseEditorControls()

  return (
    <div className={styles.editor}>
      <Editor
        {...props}
        editorState={baseContext?.editorState}
        onChange={baseContext?.onChange}
        blockStyleFn={blockStyleFn}
        handleKeyCommand={baseContext?.handleKeyCommand}
      />
    </div>
  )
}

export default BaseEditor
