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
import React, { useState, useCallback } from 'react'

import InlineStyleControls from './editor/InlineStyleControls'
import BlockStyleControls from './editor/BlockStyleControls'
import FieldSuggestionsPopup, {
  decorators,
} from './editor/FieldSuggestionsPopup'
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

  const handleStyleToggle = useCallback(
    (style: string) => {
      setEditor(RichUtils.toggleInlineStyle(editor, style))
    },
    [editor]
  )

  const handleBlockStyleToggle = useCallback(
    (style: string) => {
      setEditor(RichUtils.toggleBlockType(editor, style))
    },
    [editor]
  )

  const handleAddField = () => {
    // TODO: add the field entity
  }

  const handleSearchChange = useCallback(
    (value: string) => {
      setSuggestions(fields.filter(({ name }) => name.startsWith(value)))
    },
    [fields]
  )

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
      <FieldSuggestionsPopup
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
