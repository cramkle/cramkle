import { useQuery } from '@apollo/react-hooks'
import { Trans } from '@lingui/macro'
import gql from 'graphql-tag'
import { RawDraftContentState, convertFromRaw } from 'draft-js'
import React, { useState } from 'react'
import { useParams } from 'react-router'
import { Helmet } from 'react-helmet'

import useTopBarLoading from 'hooks/useTopBarLoading'
import Container from 'views/Container'
import Divider from 'views/Divider'
import BackButton from 'components/BackButton'
import * as t from 'views/Typography'
import {
  NoteQuery,
  NoteQueryVariables,
  NoteQuery_note_cards,
} from './__generated__/NoteQuery'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'components/views/Table'
import Checkbox from 'components/views/Checkbox'
import Button from 'components/views/Button'
import Dialog, { DialogContent } from 'components/views/Dialog'
import FlashCardRenderer from 'components/FlashCardRenderer'
import FieldValueEditor from 'components/FieldValueEditor'
import FlashCardStatus from 'components/FlashCardStatus'

const NOTE_QUERY = gql`
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
      cards {
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

const NotePage: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>()
  const { data, loading } = useQuery<NoteQuery, NoteQueryVariables>(
    NOTE_QUERY,
    { variables: { noteId } }
  )
  const [
    flashCardPreview,
    setFlashCardPreview,
  ] = useState<NoteQuery_note_cards | null>(null)

  useTopBarLoading(loading)

  const handleShowFlashCardPreview = (flashCard: NoteQuery_note_cards) => {
    setFlashCardPreview(flashCard)
  }

  const handleCloseFlashCardPreview = () => {
    setFlashCardPreview(null)
  }

  if (loading) {
    return null
  }

  const {
    note: {
      id,
      values,
      deck,
      model: { primaryField },
      cards,
    },
  } = data

  const contentState = convertFromRaw(
    values.find((value) => value.field.id === primaryField?.id)
      ?.data as RawDraftContentState
  )

  const noteIdentifier = contentState?.getPlainText() ?? id

  return (
    <>
      {flashCardPreview && (
        <Dialog open onClose={handleCloseFlashCardPreview}>
          <DialogContent>
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
          </DialogContent>
        </Dialog>
      )}
      <Helmet title={noteIdentifier} />
      <Container>
        <BackButton />

        <div className="flex flex-column mb3">
          <t.Caption>
            <Trans>Deck "{deck.title}"</Trans>
          </t.Caption>
          <t.Headline5 className="mt1">
            <Trans>Note "{noteIdentifier}"</Trans>
          </t.Headline5>
        </div>

        {values.map((value) => (
          <React.Fragment key={value.id}>
            <t.Caption>{value.field.name}</t.Caption>
            <FieldValueEditor
              className="mb3 mt1"
              initialContentState={value.data}
              field={value.field}
            />
          </React.Fragment>
        ))}

        <Divider className="mv3" />

        <t.Body1 className="fw5">Flashcards</t.Body1>

        <Table className="mt3 w-100">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Flash Card</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Template</TableCell>
              <TableCell>Lapses</TableCell>
              <TableCell>Due Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cards.map((flashCard) => (
              <TableRow key={flashCard.id}>
                <TableCell className="flex justify-center items-center">
                  <Checkbox checked={flashCard.active} />
                </TableCell>
                <TableCell>{flashCard.id}</TableCell>
                <TableCell>
                  <FlashCardStatus status={flashCard.state} />
                </TableCell>
                <TableCell>{flashCard.template.name}</TableCell>
                <TableCell align="right">{flashCard.lapses}</TableCell>
                <TableCell>{flashCard.due}</TableCell>
                <TableCell>
                  <Button onClick={() => handleShowFlashCardPreview(flashCard)}>
                    Preview
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
