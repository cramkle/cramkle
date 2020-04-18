import { RawDraftContentState, convertFromRaw } from 'draft-js'
import { NoteQuery_note } from 'components/pages/__generated__/NoteQuery'

type Note = Omit<NoteQuery_note, 'deck' | 'cards' | '__typename'>

export const getNoteIdentifier = (note: Note): string => {
  const primaryFieldValue = note.values.find(
    (value) => value.field.id === note.model?.primaryField?.id
  )

  if (!primaryFieldValue) {
    return note.id
  }

  const contentState = convertFromRaw(
    primaryFieldValue.data as RawDraftContentState
  )

  return contentState.getPlainText()
}
