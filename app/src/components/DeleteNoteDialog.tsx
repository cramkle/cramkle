import { useMutation } from '@apollo/react-hooks'
import { Trans, plural } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import gql from 'graphql-tag'
import React from 'react'

import { getNoteIdentifier } from '../utils/noteIdentifier'
import {
  DeleteNoteMutation,
  DeleteNoteMutationVariables,
} from './__generated__/DeleteNoteMutation'
import Button from './views/Button'
import { Dialog, DialogTitle } from './views/Dialog'

const DELETE_NOTE_MUTATION = gql`
  mutation DeleteNoteMutation($noteId: ID!) {
    deleteNote(noteId: $noteId) {
      id
    }
  }
`

const DeleteNoteDialog: React.FC<any> = ({ note, onClose }) => {
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

  return (
    <Dialog isOpen onDismiss={onClose} role="alertdialog">
      <DialogTitle>
        <Trans>Delete note {noteIdentifier}</Trans>
      </DialogTitle>
      <Trans>
        Are you sure you want to delete this note?{' '}
        {i18n._(
          plural(note.cards.length, {
            one: 'It contains one flashcard',
            other: 'It contains # flashcards',
          })
        )}
      </Trans>
      <Button onClick={onClose} disabled={loading}>
        <Trans>Cancel</Trans>
      </Button>
      <Button onClick={handleDelete} disabled={loading}>
        <Trans>Delete</Trans>
      </Button>
    </Dialog>
  )
}

export default DeleteNoteDialog
