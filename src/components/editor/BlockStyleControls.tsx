import { t } from '@lingui/macro'
import classnames from 'classnames'
import type { ContentBlock, ContentState, EditorState } from 'draft-js'
import { Modifier } from 'draft-js'
import { memo, useCallback } from 'react'
import * as React from 'react'

import AlignCenterIcon from '../icons/AlignCenterIcon'
import AlignLeftIcon from '../icons/AlignLeftIcon'
import AlignRightIcon from '../icons/AlignRightIcon'
import ListBulletedIcon from '../icons/ListBulletedIcon'
import ListNumberedIcon from '../icons/ListNumberedIcon'
import QuoteIcon from '../icons/QuoteIcon'
import styles from './BlockStyleControls.css'
import type { Style } from './StyleButton'
import StyleButton from './StyleButton'

export const BLOCK_TYPES: Style[] = [
  { label: t`H1`, style: 'header-one' },
  { label: t`H2`, style: 'header-two' },
  { label: t`H3`, style: 'header-three' },
  { label: t`H4`, style: 'header-four' },
  { label: t`H5`, style: 'header-five' },
  { label: t`H6`, style: 'header-six' },
  { label: t`Blockquote`, style: 'blockquote', icon: <QuoteIcon /> },
  { label: t`UL`, style: 'unordered-list-item', icon: <ListBulletedIcon /> },
  { label: t`OL`, style: 'ordered-list-item', icon: <ListNumberedIcon /> },
  { label: t`Code Block`, style: 'code-block' },
]

export const ALIGN_LEFT = 'alignLeft'
export const ALIGN_CENTER = 'alignCenter'
export const ALIGN_RIGHT = 'alignRight'

export const ALIGNMENT_STYLES: Style[] = [
  {
    label: t`Align left`,
    style: ALIGN_LEFT,
    icon: <AlignLeftIcon />,
  },
  {
    label: t`Align center`,
    style: ALIGN_CENTER,
    icon: <AlignCenterIcon />,
  },
  {
    label: t`Align right`,
    style: ALIGN_RIGHT,
    icon: <AlignRightIcon />,
  },
]

export const ALIGNMENT_DATA_KEY = 'textAlignment'

const getAlignmentStyles = (blockAlignment: string) => {
  switch (blockAlignment) {
    case ALIGN_LEFT:
      return styles.alignLeft
    case ALIGN_CENTER:
      return styles.alignCenter
    case ALIGN_RIGHT:
      return styles.alignRight
  }
}

const getBlockTypeStyle = (blockType: string) => {
  switch (blockType) {
    case 'header-one':
      return 'text-4xl leading-normal'
    case 'header-two':
      return 'text-3xl leading-normal'
    case 'header-three':
      return 'text-2xl leading-normal'
    case 'header-four':
      return 'text-xl leading-normal'
    case 'header-five':
      return 'text-lg leading-normal'
    case 'header-six':
      return 'text-base leading-normal'
    case 'unordered-list-item':
      return 'list-disc'
    case 'ordered-list-item':
      return 'list-decimal'
    case 'blockquote':
      return 'border-l-4 border-secondary pl-2 text-txt text-opacity-text-secondary'
    case 'code-block':
      return 'font-mono p-2 bg-secondary bg-opacity-secondary'
  }
}

export const blockStyleFn = (contentBlock: ContentBlock) => {
  const blockData = contentBlock.getData()
  const blockType = contentBlock.getType()

  const blockAlignment = blockData.has(ALIGNMENT_DATA_KEY)
    ? blockData.get(ALIGNMENT_DATA_KEY)
    : undefined

  let alignmentStyle = ''

  if (blockAlignment) {
    alignmentStyle = getAlignmentStyles(blockAlignment) ?? ''
  }

  const blockStyle = getBlockTypeStyle(blockType)

  return classnames(alignmentStyle, blockStyle)
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
    <div className="w-full mb-2 text-sm flex overflow-x-auto">
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
