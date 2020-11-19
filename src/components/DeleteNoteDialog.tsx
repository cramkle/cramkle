import { useMutation } from '@apollo/react-hooks'
import { Plural, Trans } from '@lingui/macro'
import gql from 'graphql-tag'
import { useRef } from 'react'
import * as React from 'react'

import {
  DeleteNoteMutation,
  DeleteNoteMutationVariables,
} from './__generated__/DeleteNoteMutation'
import { DeckQuery_deck_notes_edges_node } from './pages/__generated__/DeckQuery'
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogLabel,
} from './views/AlertDialog'
import Button from './views/Button'

const DELETE_NOTE_MUTATION = gql`
  mutation DeleteNoteMutation($noteId: ID!) {
    deleteNote(input: { noteId: $noteId }) {
      note {
        id
      }
    }
  }
`

interface Props {
  note: DeckQuery_deck_notes_edges_node
  onClose?: () => void
  onDeleted?: () => void
}

const DeleteNoteDialog: React.FC<Props> = ({ note, onClose, onDeleted }) => {
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

    onDeleted?.()
    onClose?.()
  }

  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <AlertDialog isOpen onDismiss={onClose} leastDestructiveRef={cancelRef}>
      <AlertDialogLabel>
        <Trans>Delete note {note.text}</Trans>
      </AlertDialogLabel>
      <AlertDialogDescription>
        <Trans>
          Are you sure you want to delete this note?{' '}
          <Plural
            value={note.flashCards.length}
            one="It contains one flashcard"
            other="It contains # flashcards"
          />
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
