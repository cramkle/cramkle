import { t } from '@lingui/macro'
import { EditorState } from 'draft-js'
import React, { memo } from 'react'

import StyleButton, { Style } from './StyleButton'

export const BLOCK_TYPES: Style[] = [
  { label: t`H1`, style: 'header-one' },
  { label: t`H2`, style: 'header-two' },
  { label: t`H3`, style: 'header-three' },
  { label: t`H4`, style: 'header-four' },
  { label: t`H5`, style: 'header-five' },
  { label: t`H6`, style: 'header-six' },
  { label: t`Blockquote`, style: 'blockquote', icon: 'format_quote' },
  { label: t`UL`, style: 'unordered-list-item', icon: 'format_list_bulleted' },
  { label: t`OL`, style: 'ordered-list-item', icon: 'format_list_numbered' },
  { label: t`Code Block`, style: 'code-block' },
]

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
          key={type.style}
          active={type.style === blockType}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
          icon={type.icon}
        />
      ))}
    </div>
  )
}

export default memo(BlockStyleControls)
