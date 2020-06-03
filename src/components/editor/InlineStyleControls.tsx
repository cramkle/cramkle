import { t } from '@lingui/macro'
import { EditorState } from 'draft-js'
import React from 'react'

import BoldFormatIcon from '../icons/BoldFormatIcon'
import ItalicFormatIcon from '../icons/ItalicFormatIcon'
import UnderlineFormatIcon from '../icons/UnderlineFormatIcon'
import StyleButton, { Style } from './StyleButton'

export const INLINE_STYLES: Style[] = [
  { label: t`Bold`, style: 'BOLD', icon: <BoldFormatIcon /> },
  { label: t`Italic`, style: 'ITALIC', icon: <ItalicFormatIcon /> },
  { label: t`Underline`, style: 'UNDERLINE', icon: <UnderlineFormatIcon /> },
  { label: t`Monospace`, style: 'CODE' },
]

const InlineStyleControls: React.FunctionComponent<{
  editor: EditorState
  onToggle: (s: string) => void
}> = ({ editor, onToggle }) => {
  const currentStyle = editor.getCurrentInlineStyle()

  return (
    <div className="text-sm flex">
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
