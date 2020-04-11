import { t } from '@lingui/macro'
import { EditorState } from 'draft-js'
import React from 'react'

import StyleButton, { Style } from './StyleButton'

export const INLINE_STYLES: Style[] = [
  { label: t`Bold`, style: 'BOLD', icon: 'format_bold' },
  { label: t`Italic`, style: 'ITALIC', icon: 'format_italic' },
  { label: t`Underline`, style: 'UNDERLINE', icon: 'format_underlined' },
  { label: t`Monospace`, style: 'CODE' },
]

const InlineStyleControls: React.FunctionComponent<{
  editor: EditorState
  onToggle: (s: string) => void
}> = ({ editor, onToggle }) => {
  const currentStyle = editor.getCurrentInlineStyle()

  return (
    <div className="f6">
      {INLINE_STYLES.map((type) => (
        <StyleButton
          key={type.style}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
          icon={type.icon}
        />
      ))}
    </div>
  )
}

export default InlineStyleControls
