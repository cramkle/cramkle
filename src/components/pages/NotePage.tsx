import { useMutation, useQuery } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import classnames from 'classnames'
import { ContentState, RawDraftContentState, convertToRaw } from 'draft-js'
import gql from 'graphql-tag'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router'

import { useBlock } from '../../hooks/useBlock'
import useTopBarLoading from '../../hooks/useTopBarLoading'
import { notificationState } from '../../notification'
import BackButton from '../BackButton'
import FieldValueEditor from '../FieldValueEditor'
import FlashCardRenderer from '../FlashCardRenderer'
import FlashCardStatus from '../FlashCardStatus'
import DoneIcon from '../icons/DoneIcon'
import RetryIcon from '../icons/RetryIcon'
import Button from '../views/Button'
import { Checkbox } from '../views/Checkbox'
import CircularProgress from '../views/CircularProgress'
import Container from '../views/Container'
import { Dialog } from '../views/Dialog'
import Divider from '../views/Divider'
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
      text
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
        status
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
    updateFieldValue(
      input: { noteId: $noteId, fieldId: $fieldId, data: $data }
    ) {
      fieldValue {
        id
        data {
          ...DraftContent
        }
      }
    }
  }
`

const FIELD_VALUE_CHANGE_DEBOUNCE = 1000 /* ms */

interface FieldValueDetailProps {
  noteId: string
  fieldValue: NoteQuery_note_values
}

const FieldValueDetail: React.FC<FieldValueDetailProps> = ({
  noteId,
  fieldValue,
}) => {
  const [updateFieldValueMutation, { loading, error }] = useMutation<
    UpdateFieldValue,
    UpdateFieldValueVariables
  >(UPDATE_FIELD_VALUE_MUTATION)

  const debounceIdRef = useRef<NodeJS.Timeout | null>(null)

  const lastChangedContentStateRef = useRef<[ContentState, string] | null>(null)

  const handleChange = useCallback(
    (content: ContentState, field: { id: string }) => {
      lastChangedContentStateRef.current = [content, field.id]
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

  const retrySave = useCallback(() => {
    if (!lastChangedContentStateRef.current) {
      return
    }

    const [content, fieldId] = lastChangedContentStateRef.current

    updateFieldValueMutation({
      variables: {
        noteId,
        fieldId,
        data: convertToRaw(content),
      },
    })
  }, [noteId, updateFieldValueMutation])

  const [saved, setSaved] = useState(false)
  const prevLoadingRef = useRef(loading)

  const { i18n } = useLingui()

  useBlock(
    loading || !!error,
    i18n._(t`Your note is not saved, are you sure you want to exit the page?`)
  )

  useEffect(() => {
    if (prevLoadingRef.current === loading || loading) {
      if (loading) {
        setSaved(false)
      }
      return
    }

    if (error) {
      notificationState.addNotification({
        message: i18n._(t`An error occurred when saving your note`),
        actionText: i18n._(t`Retry`),
        onAction: retrySave,
      })
      return
    }

    setSaved(true)
  }, [loading, error, i18n, retrySave])

  useEffect(() => {
    prevLoadingRef.current = loading
  }, [loading])

  useEffect(function hideSavedMessageEffect() {
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
        <div className="ml-2 flex items-center">
          {loading && <CircularProgress size={16} />}
          {error && (
            <button
              className="flex items-center text-red-1 text-sm rounded hover:bg-hover-overlay border border-red-1 px-2 py-1"
              onClick={retrySave}
            >
              <RetryIcon className="mr-2 h-4 w-4" />
              <Trans>Try again</Trans>
            </button>
          )}
          <Caption
            className={classnames(
              'inline-flex items-center invisible opacity-0',
              {
                [styles.fadeIn]: saved,
                [styles.fadeOut]: prevSavedRef.current && !saved,
              }
            )}
          >
            <DoneIcon className="text-green-1 mr-2 text-base" />
            <Trans>Changes saved successfully</Trans>
          </Caption>
        </div>
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
    note: { values, deck, flashCards, text },
  } = data

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
      <Helmet title={text} />
      <Container>
        <BackButton to={`/d/${deckSlug}`} />

        <div className="flex flex-col mb-8">
          <Caption className="mt-1 text-secondary">
            <Trans>Deck {deck.title}</Trans>
          </Caption>
          <Headline1>
            <Trans>Note details</Trans>
          </Headline1>
          <Headline2 className="mt-4">{text}</Headline2>
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
                  <FlashCardStatus status={flashCard.status} />
                </TableCell>
                <TableCell>{flashCard.lapses}</TableCell>
                <TableCell>
                  {flashCard.due && i18n.date(new Date(flashCard.due), {})}
                </TableCell>
                <TableCell align="right">
                  <Button onClick={() => handleShowFlashCardPreview(flashCard)}>
                    <Trans>Preview</Trans>
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
