import { useMutation, useQuery } from '@apollo/react-hooks'
import { Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import classnames from 'classnames'
import { ContentState, RawDraftContentState, convertToRaw } from 'draft-js'
import gql from 'graphql-tag'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router'

import useTopBarLoading from '../../hooks/useTopBarLoading'
import { getNoteIdentifier } from '../../utils/noteIdentifier'
import BackButton from '../BackButton'
import FieldValueEditor from '../FieldValueEditor'
import FlashCardRenderer from '../FlashCardRenderer'
import FlashCardStatus from '../FlashCardStatus'
import Button from '../views/Button'
import { Checkbox } from '../views/Checkbox'
import CircularProgress from '../views/CircularProgress'
import Container from '../views/Container'
import { Dialog } from '../views/Dialog'
import Divider from '../views/Divider'
import Icon from '../views/Icon'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '../views/Table'
import {
  Body1,
  Caption,
  Headline1,
  Headline2,
  Headline3,
} from '../views/Typography'
import styles from './NotePage.css'
import {
  NoteQuery,
  NoteQueryVariables,
  NoteQuery_note_flashCards,
  NoteQuery_note_values,
} from './__generated__/NoteQuery'
import {
  UpdateFieldValue,
  UpdateFieldValueVariables,
} from './__generated__/UpdateFieldValue'

const DRAFT_CONTENT_FRAGMENT = gql`
  fragment DraftContent on ContentState {
    id
    blocks {
      key
      type
      text
      depth
      inlineStyleRanges {
        style
        offset
        length
      }
      entityRanges {
        key
        length
        offset
      }
      data
    }
    entityMap
  }
`

const NOTE_QUERY = gql`
  ${DRAFT_CONTENT_FRAGMENT}

  query NoteQuery($noteId: ID!) {
    note(id: $noteId) {
      id
      deck {
        title
      }
      model {
        primaryField {
          id
        }
      }
      values {
        id
        data {
          ...DraftContent
        }
        field {
          id
          name
        }
      }
      flashCards {
        id
        active
        lapses
        due
        state
        template {
          name
          frontSide {
            ...DraftContent
          }
          backSide {
            ...DraftContent
          }
        }
      }
    }
  }
`

const UPDATE_FIELD_VALUE_MUTATION = gql`
  ${DRAFT_CONTENT_FRAGMENT}

  mutation UpdateFieldValue(
    $noteId: ID!
    $fieldId: ID!
    $data: ContentStateInput!
  ) {
    updateFieldValue(noteId: $noteId, fieldId: $fieldId, data: $data) {
      id
      data {
        ...DraftContent
      }
    }
  }
`

const FIELD_VALUE_CHANGE_DEBOUNCE = 500 /* ms */

interface FieldValueDetailProps {
  noteId: string
  fieldValue: NoteQuery_note_values
}

const FieldValueDetail: React.FC<FieldValueDetailProps> = ({
  noteId,
  fieldValue,
}) => {
  const [updateFieldValueMutation, { loading }] = useMutation<
    UpdateFieldValue,
    UpdateFieldValueVariables
  >(UPDATE_FIELD_VALUE_MUTATION)

  const debounceIdRef = useRef<NodeJS.Timeout | null>(null)

  const handleChange = useCallback(
    (content: ContentState, field: { id: string }) => {
      if (debounceIdRef.current) {
        clearTimeout(debounceIdRef.current)
      }

      debounceIdRef.current = setTimeout(() => {
        updateFieldValueMutation({
          variables: {
            noteId,
            fieldId: field.id,
            data: convertToRaw(content),
          },
        })
      }, FIELD_VALUE_CHANGE_DEBOUNCE)
    },
    [noteId, updateFieldValueMutation]
  )

  const [saved, setSaved] = useState(false)
  const prevLoadingRef = useRef(loading)

  useEffect(() => {
    if (prevLoadingRef.current === loading || loading) {
      return
    }

    setSaved(true)
  }, [loading])

  useEffect(() => {
    prevLoadingRef.current = loading
  }, [loading])

  useEffect(() => {
    if (!saved) {
      return
    }

    const id = setTimeout(() => {
      setSaved(false)
    }, 2000)

    return () => clearTimeout(id)
  })

  const prevSavedRef = useRef(saved)

  useEffect(() => {
    prevSavedRef.current = saved
  }, [saved])

  return (
    <>
      <Body1 className="h-8 flex items-center">
        {fieldValue.field.name}{' '}
        {loading && <CircularProgress className="ml-2" size={16} />}
        <Caption
          className={classnames(
            'inline-flex items-center ml-2 invisible opacity-0',
            {
              [styles.fadeIn]: saved,
              [styles.fadeOut]: prevSavedRef.current && !saved,
            }
          )}
        >
          <Icon className="text-success mr-2 text-base" icon="check" />
          <Trans>Changes saved successfully</Trans>
        </Caption>
      </Body1>
      <FieldValueEditor
        className="mb-4 mt-1"
        initialContentState={fieldValue.data}
        field={fieldValue.field}
        onChange={handleChange}
      />
    </>
  )
}

const NotePage: React.FC = () => {
  const { slug: deckSlug, noteId } = useParams<{
    slug: string
    noteId: string
  }>()
  const { data, loading } = useQuery<NoteQuery, NoteQueryVariables>(
    NOTE_QUERY,
    { variables: { noteId } }
  )
  const [
    flashCardPreview,
    setFlashCardPreview,
  ] = useState<NoteQuery_note_flashCards | null>(null)
  const { i18n } = useLingui()

  useTopBarLoading(loading)

  const handleShowFlashCardPreview = (flashCard: NoteQuery_note_flashCards) => {
    setFlashCardPreview(flashCard)
  }

  const handleCloseFlashCardPreview = () => {
    setFlashCardPreview(null)
  }

  if (loading) {
    return null
  }

  const {
    note: { values, deck, flashCards },
    note,
  } = data

  const noteIdentifier = getNoteIdentifier(note)

  return (
    <>
      {flashCardPreview && (
        <Dialog isOpen onDismiss={handleCloseFlashCardPreview}>
          <FlashCardRenderer
            values={values.map(({ data, ...value }) => ({
              ...value,
              data: data as RawDraftContentState,
            }))}
            hideBackSide={false}
            template={
              flashCardPreview.template as {
                frontSide: RawDraftContentState
                backSide: RawDraftContentState
              }
            }
          />
        </Dialog>
      )}
      <Helmet title={noteIdentifier} />
      <Container>
        <BackButton to={`/d/${deckSlug}`} />

        <div className="flex flex-col mb-8">
          <Caption className="mt-1 text-secondary">
            <Trans>Deck {deck.title}</Trans>
          </Caption>
          <Headline1>
            <Trans>Note details</Trans>
          </Headline1>
          <Headline2 className="mt-4">{noteIdentifier}</Headline2>
        </div>

        {values.map((value) => (
          <FieldValueDetail
            noteId={data.note.id}
            fieldValue={value}
            key={value.id}
          />
        ))}

        <Divider className="my-8" />

        <Headline3 className="font-medium">
          <Trans>Flashcards</Trans>
        </Headline3>

        <Table className="mt-4 mb-8 w-full">
          <TableHead>
            <TableRow>
              <TableCell className="w-0" />
              <TableCell>Template</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Lapses</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {flashCards.map((flashCard) => (
              <TableRow key={flashCard.id}>
                <TableCell className="flex justify-center items-center">
                  <Checkbox checked={flashCard.active} />
                </TableCell>
                <TableCell>{flashCard.template.name}</TableCell>
                <TableCell>
                  <FlashCardStatus status={flashCard.state} />
                </TableCell>
                <TableCell>{flashCard.lapses}</TableCell>
                <TableCell>
                  {flashCard.due && i18n.date(new Date(flashCard.due), {})}
                </TableCell>
                <TableCell align="right">
                  <Button
                    className="normal-case tracking-normal"
                    onClick={() => handleShowFlashCardPreview(flashCard)}
                  >
                    <span className="text-base font-normal">
                      <Trans>Preview</Trans>
                    </span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </>
  )
}

export default NotePage
