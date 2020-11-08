import type { EditorProps } from 'draft-js'
import { Editor } from 'draft-js'
import 'draft-js/dist/Draft.css'
import * as React from 'react'

import styles from './BaseEditor.css'
import { useBaseEditorControls } from './BaseEditorContext'
import { blockStyleFn } from './BlockStyleControls'
import { inlineStyleMap } from './InlineStyleControls'

type Props = Omit<
  EditorProps,
  'onChange' | 'editorState' | 'blockStyleFn' | 'handleKeyCommand'
>

const BaseEditor: React.FC<Props> = (props) => {
  const baseContext = useBaseEditorControls()

  const placeholder =
    baseContext.editorState
      .getCurrentContent()
      .getBlockMap()
      .first()
      .getType() !== 'unstyled'
      ? undefined
      : props.placeholder

  return (
    <div className={styles.editor}>
      <Editor
        {...props}
        placeholder={placeholder}
        editorState={baseContext?.editorState}
        onChange={baseContext?.onChange}
        blockStyleFn={blockStyleFn}
        customStyleMap={inlineStyleMap}
        handleKeyCommand={baseContext?.handleKeyCommand}
      />
    </div>
  )
}

export default BaseEditor
