import { Trans } from '@lingui/macro'
import { useCallback, useRef, useState } from 'react'
import * as React from 'react'

import { GenericAddIcon } from './icons/GenericAddIcon'
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogLabel,
} from './views/AlertDialog'
import { Button } from './views/Button'

interface Props {
  deckId: string
}

const ImportPublishedDeckButton: React.FunctionComponent<Props> = ({
  deckId,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [importing, setImporting] = useState(false)

  const handleImport = () => {
    // TODO: Import deck
    console.log(`handleImport ${deckId}`)
    setImporting(true)
  }

  const handleClose = useCallback(() => {
    if (importing) {
      return
    }

    setDialogOpen(false)
  }, [importing])

  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button
        className="my-2 flex-shrink-0"
        variation="outline"
        onClick={() => setDialogOpen(true)}
      >
        <GenericAddIcon className="mr-2 flex-shrink-0" />
        <Trans>Import published deck</Trans>
      </Button>
      <AlertDialog
        isOpen={dialogOpen}
        onDismiss={handleClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogLabel>
          <Trans>Import published deck</Trans>
        </AlertDialogLabel>
        <AlertDialogDescription>
          <Trans>This action will add this deck to your library.</Trans>
        </AlertDialogDescription>
        <div className="flex justify-end items-center">
          <Button
            onClick={() => setDialogOpen(false)}
            disabled={importing}
            ref={cancelRef}
            variation="secondary"
          >
            <Trans>Cancel</Trans>
          </Button>
          <Button className="ml-3" onClick={handleImport} disabled={importing}>
            <Trans>Import deck</Trans>
          </Button>
        </div>
      </AlertDialog>
    </>
  )
}

export default ImportPublishedDeckButton
