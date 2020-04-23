import { t } from '@lingui/macro'
import { IconTypes } from 'components/views/IconTypes'
import { ContentBlock, ContentState, EditorState, Modifier } from 'draft-js'
import React, { memo, useCallback } from 'react'

import styles from './BlockStyleControls.css'
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

export const ALIGN_LEFT = 'alignLeft'
export const ALIGN_CENTER = 'alignCenter'
export const ALIGN_RIGHT = 'alignRight'

export const ALIGNMENT_STYLES = [
  {
    label: t`Align left`,
    style: ALIGN_LEFT,
    icon: 'format_align_left' as IconTypes,
  },
  {
    label: t`Align center`,
    style: ALIGN_CENTER,
    icon: 'format_align_center' as IconTypes,
  },
  {
    label: t`Align right`,
    style: ALIGN_RIGHT,
    icon: 'format_align_right' as IconTypes,
  },
]

export const ALIGNMENT_DATA_KEY = 'textAlignment'

export const blockStyleFn = (contentBlock: ContentBlock) => {
  const blockData = contentBlock.getData()

  const blockAlignment = blockData.has(ALIGNMENT_DATA_KEY)
    ? blockData.get(ALIGNMENT_DATA_KEY)
    : undefined

  if (blockAlignment) {
    switch (blockAlignment) {
      case ALIGN_LEFT:
        return styles.alignLeft
      case ALIGN_CENTER:
        return styles.alignCenter
      case ALIGN_RIGHT:
        return styles.alignRight
    }
  }
}

const BlockStyleControls: React.FunctionComponent<{
  editor: EditorState
  onToggle: (s: string | ContentState) => void
}> = ({ editor, onToggle }) => {
  const selection = editor.getSelection()
  const selectionBlock = editor
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())

  const blockType = selectionBlock.getType()
  const blockData = selectionBlock.getData()

  const currentAlignment = blockData.has(ALIGNMENT_DATA_KEY)
    ? blockData.get(ALIGNMENT_DATA_KEY)
    : undefined

  const handleToggleAlignment = useCallback(
    (style: string) => {
      onToggle(
        Modifier.mergeBlockData(
          editor.getCurrentContent(),
          selection,
          blockData.set(
            ALIGNMENT_DATA_KEY,
            currentAlignment !== style ? style : undefined
          )
        )
      )
    },
    [onToggle, blockData, editor, selection, currentAlignment]
  )

  return (
    <div className="mb2 f6">
      {BLOCK_TYPES.map((type) => (
        <StyleButton
          key={type.style}
          active={type.style === blockType}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
          icon={type.icon}
        />
      ))}
      {ALIGNMENT_STYLES.map((alignmentStyle) => (
        <StyleButton
          key={alignmentStyle.style}
          style={alignmentStyle.style}
          label={alignmentStyle.label}
          icon={alignmentStyle.icon}
          onToggle={handleToggleAlignment}
          active={currentAlignment === alignmentStyle.style}
        />
      ))}
    </div>
  )
}

export default memo(BlockStyleControls)
