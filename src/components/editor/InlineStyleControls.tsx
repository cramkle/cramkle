import { Trans, t } from '@lingui/macro'
import { RichUtils } from 'draft-js'
import type { SelectionState } from 'draft-js'
import * as React from 'react'
import { useCallback, useRef, useState } from 'react'

import { BoldFormatIcon } from '../icons/BoldFormatIcon'
import { CodeIcon } from '../icons/CodeIcon'
import { ItalicFormatIcon } from '../icons/ItalicFormatIcon'
import { LinkIcon } from '../icons/LinkIcon'
import { UnderlineFormatIcon } from '../icons/UnderlineFormatIcon'
import { Button } from '../views/Button'
import { Dialog, DialogTitle } from '../views/Dialog'
import { Input } from '../views/Input'
import { useBaseEditorControls } from './BaseEditorContext'
import StyleButton from './StyleButton'
import type { Style } from './StyleButton'

export const inlineStyleMap = {
  CODE: {
    fontFamily: 'Menlo, monospace',
    backgroundColor: 'var(--secondary)',
    fontSize: '96%',
    padding: '1px .25rem',
    textTransform: 'none',
    overflowWrap: 'break-word',
  },
} as const

export const INLINE_STYLES: Style[] = [
  { label: t`Bold`, style: 'BOLD', icon: <BoldFormatIcon /> },
  { label: t`Italic`, style: 'ITALIC', icon: <ItalicFormatIcon /> },
  { label: t`Underline`, style: 'UNDERLINE', icon: <UnderlineFormatIcon /> },
  { label: t`Monospace`, style: 'CODE', icon: <CodeIcon /> },
]

const linkIcon = <LinkIcon />

const InlineStyleControls: React.VFC<{ hidden: boolean }> = ({ hidden }) => {
  const { editorState, onChange } = useBaseEditorControls()

  const handleStyleToggle = useCallback(
    (style: string) => {
      onChange(RichUtils.toggleInlineStyle(editorState, style))
    },
    [editorState, onChange]
  )

  const currentStyle = editorState.getCurrentInlineStyle()

  const containsLink = RichUtils.currentBlockContainsLink(editorState)

  const linkUrlInputRef = useRef<HTMLInputElement>(null)
  const [linkSelection, setLinkSelection] = useState<SelectionState | null>(
    null
  )
  const [linkModalOpen, setLinkModalOpen] = useState(false)

  const handleLinkSubmit: React.MouseEventHandler<HTMLButtonElement> = (
    evt
  ) => {
    evt.preventDefault()

    const url = linkUrlInputRef.current?.value

    if (!url) {
      setLinkModalOpen(false)
      return
    }

    const updatedContentWithLinkEntity = editorState
      .getCurrentContent()
      .createEntity('LINK', 'MUTABLE', { url })

    const entityKey = updatedContentWithLinkEntity.getLastCreatedEntityKey()

    const updatedStateWithLinkEntity = RichUtils.toggleLink(
      editorState,
      linkSelection!,
      entityKey
    )
    onChange(updatedStateWithLinkEntity)

    setLinkModalOpen(false)
    setLinkSelection(null)
  }

  const handleAddLink = useCallback(() => {
    const selection = editorState.getSelection()

    if (selection.isCollapsed()) {
      return
    }

    if (RichUtils.currentBlockContainsLink(editorState)) {
      onChange(RichUtils.toggleLink(editorState, selection, null))
    } else {
      setLinkSelection(selection)
      setLinkModalOpen(true)
    }
  }, [editorState, onChange])

  return (
    <>
      <div className="text-sm flex">
        {INLINE_STYLES.map((type) => (
          <StyleButton
            className="mr-1"
            key={type.style}
            active={currentStyle.has(type.style)}
            label={type.label}
            onToggle={handleStyleToggle}
            style={type.style}
            icon={type.icon}
            hidden={hidden}
          />
        ))}
        <StyleButton
          active={containsLink}
          onToggle={handleAddLink}
          label={t`Link`}
          icon={linkIcon}
          style=""
          hidden={hidden}
        />
      </div>
      {linkModalOpen && (
        <Dialog
          isOpen={linkModalOpen}
          onDismiss={() => setLinkModalOpen(false)}
          aria-labelledby="link-modal-title"
        >
          <DialogTitle id="link-modal-title">
            <Trans>Add new link</Trans>
          </DialogTitle>
          <Input
            className="w-full"
            placeholder="Link url, e.g.: https://cramkle.com/"
            ref={linkUrlInputRef}
          />
          <Button onClick={handleLinkSubmit}>
            <Trans>Submit</Trans>
          </Button>
        </Dialog>
      )}
    </>
  )
}

export default InlineStyleControls
