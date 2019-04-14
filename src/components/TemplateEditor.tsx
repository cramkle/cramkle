import Card, { CardActions, CardActionButtons } from '@material/react-card'
import Button from '@material/react-button'
import cx from 'classnames'
import {
  Editor,
  EditorState,
  RichUtils,
  ContentState,
  ContentBlock,
} from 'draft-js'
import 'draft-js/dist/Draft.css'
import React, { useState } from 'react'

import InlineStyleControls from './editor/InlineStyleControls'
import BlockStyleControls from './editor/BlockStyleControls'
import styles from './TemplateEditor.module.scss'

const TemplateEditor: React.FunctionComponent<{
  id: string
  template: ContentBlock[]
}> = ({ template }) => {
  const [editor, setEditor] = useState(() => {
    if (template.length === 0) {
      return EditorState.createEmpty()
    }

    const contentState = ContentState.createFromBlockArray(template)

    return EditorState.createWithContent(contentState)
  })

  const handleStyleToggle = (style: string) => {
    setEditor(RichUtils.toggleInlineStyle(editor, style))
  }

  const handleBlockStyleToggle = (style: string) => {
    setEditor(RichUtils.toggleBlockType(editor, style))
  }

  return (
    <Card outlined className={cx(styles.templateEditor, 'mt2')}>
      <CardActions className="bb b--inherit">
        <CardActionButtons className="flex-column items-start">
          <BlockStyleControls
            editor={editor}
            onToggle={handleBlockStyleToggle}
          />
          <InlineStyleControls editor={editor} onToggle={handleStyleToggle} />
        </CardActionButtons>
      </CardActions>
      <Editor editorState={editor} onChange={setEditor} />
    </Card>
  )
}

export default TemplateEditor
