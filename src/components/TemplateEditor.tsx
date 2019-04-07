import Card, { CardActions, CardActionButtons } from '@material/react-card'
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

import styles from './TemplateEditor.module.scss'

interface Style {
  label: string
  style: string
}

const BLOCK_TYPES: Style[] = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' },
]

const INLINE_STYLES: Style[] = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' },
]

const StyleButton: React.FunctionComponent<{
  onToggle: (s: string) => void
  label: string
  style: string
  active: boolean
}> = ({ onToggle, label, style, active }) => {
  const handleToggle = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault()
    onToggle(style)
  }

  const className = cx('pointer mr3 pv1 dib', {
    gray: !active,
    'c-primary': active,
  })

  return (
    <span
      role="button"
      tabIndex={0}
      className={className}
      onMouseDown={handleToggle}
    >
      {label}
    </span>
  )
}

const InlineStyleControls: React.FunctionComponent<{
  editor: EditorState
  onToggle: (s: string) => void
}> = ({ editor, onToggle }) => {
  const currentStyle = editor.getCurrentInlineStyle()

  return (
    <div className="f6">
      {INLINE_STYLES.map(type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </div>
  )
}

const BlockStyleControls: React.FunctionComponent<{
  editor: EditorState
  onToggle: (s: string) => void
}> = ({ editor, onToggle }) => {
  const selection = editor.getSelection()
  const blockType = editor
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

  return (
    <div className="mb2 f6">
      {BLOCK_TYPES.map(type => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </div>
  )
}

const TemplateEditor: React.FunctionComponent<{ template: ContentBlock[] }> = ({
  template,
}) => {
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
        <CardActionButtons className="flex flex-column items-start">
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
