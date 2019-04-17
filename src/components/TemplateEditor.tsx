import Card, { CardActions, CardActionButtons } from '@material/react-card'
import cx from 'classnames'
import {
  Editor,
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
} from 'draft-js'
import 'draft-js/dist/Draft.css'
import React, { useState } from 'react'

import InlineStyleControls from './editor/InlineStyleControls'
import BlockStyleControls from './editor/BlockStyleControls'
import FieldSuggestions, { decorators } from './editor/FieldSuggestions'
import SaveTemplateButton from './SaveTemplateButton'
import { APIContentState } from '../types/APIContentState'
import styles from './TemplateEditor.module.scss'

const TemplateEditor: React.FunctionComponent<{
  initialContentState: APIContentState
  fields: { name: string }[]
}> = ({ initialContentState, fields }) => {
  const [editor, setEditor] = useState(() => {
    if (initialContentState.blocks.length === 0) {
      return EditorState.createEmpty(decorators)
    }

    const contentState = convertFromRaw(initialContentState)

    return EditorState.createWithContent(contentState, decorators)
  })
  const [suggestions, setSuggestions] = useState(fields)

  const handleStyleToggle = (style: string) => {
    setEditor(RichUtils.toggleInlineStyle(editor, style))
  }

  const handleBlockStyleToggle = (style: string) => {
    setEditor(RichUtils.toggleBlockType(editor, style))
  }

  const handleAddField = () => {
    // TODO: add the field entity
  }

  const handleSearchChange = (value: string) => {
    setSuggestions(fields.filter(({ name }) => name.startsWith(value)))
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
      <FieldSuggestions
        onAddField={handleAddField}
        suggestions={suggestions}
        onSearchChange={handleSearchChange}
      />
      <CardActions>
        <CardActionButtons>
          <SaveTemplateButton
            id={initialContentState.id}
            {...convertToRaw(editor.getCurrentContent())}
          />
        </CardActionButtons>
      </CardActions>
    </Card>
  )
}

export default TemplateEditor
