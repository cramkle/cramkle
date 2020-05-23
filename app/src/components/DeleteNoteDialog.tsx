import { useMutation } from '@apollo/react-hooks'
import { Trans, plural } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import gql from 'graphql-tag'
import React, { useRef } from 'react'

import { getNoteIdentifier } from '../utils/noteIdentifier'
import {
  DeleteNoteMutation,
  DeleteNoteMutationVariables,
} from './__generated__/DeleteNoteMutation'
import { DeckQuery_deck_notes } from './pages/__generated__/DeckQuery'
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogLabel,
} from './views/AlertDialog'
import Button from './views/Button'

const DELETE_NOTE_MUTATION = gql`
  mutation DeleteNoteMutation($noteId: ID!) {
    deleteNote(noteId: $noteId) {
      id
    }
  }
`

interface Props {
  note: DeckQuery_deck_notes
  onClose?: () => void
}

const DeleteNoteDialog: React.FC<Props> = ({ note, onClose }) => {
  const { i18n } = useLingui()
  const noteIdentifier = getNoteIdentifier(note)
  const [deleteNote, { loading }] = useMutation<
    DeleteNoteMutation,
    DeleteNoteMutationVariables
  >(DELETE_NOTE_MUTATION)

  const handleDelete = async () => {
    await deleteNote({
      variables: {
        noteId: note.id,
      },
    })

    onClose?.()
  }

  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <AlertDialog isOpen onDismiss={onClose} leastDestructiveRef={cancelRef}>
      <AlertDialogLabel>
        <Trans>Delete note {noteIdentifier}</Trans>
      </AlertDialogLabel>
      <AlertDialogDescription>
        <Trans>
          Are you sure you want to delete this note?{' '}
          {i18n._(
            plural(note.flashCards.length, {
              one: 'It contains one flashcard',
              other: 'It contains # flashcards',
            })
          )}
        </Trans>
      </AlertDialogDescription>
      <div className="flex justify-end items-center">
        <Button onClick={onClose} disabled={loading} ref={cancelRef}>
          <Trans>Cancel</Trans>
        </Button>
        <Button className="ml-3" onClick={handleDelete} disabled={loading}>
          <Trans>Delete</Trans>
        </Button>
      </div>
    </AlertDialog>
  )
}

export default DeleteNoteDialog
