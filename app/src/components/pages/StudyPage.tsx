import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import { Trans } from '@lingui/macro'
import classnames from 'classnames'
import gql from 'graphql-tag'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router'

import { FlashCardAnswer } from '../../globalTypes'
import FlashCardRenderer from '../FlashCardRenderer'
import Portal from '../Portal'
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogLabel,
} from '../views/AlertDialog'
import Button from '../views/Button'
import CircularProgress from '../views/CircularProgress'
import {
  AnswerFlashCard,
  AnswerFlashCardVariables,
} from './__generated__/AnswerFlashCard'

const STUDY_CARD_QUERY = gql`
  query FlashCards($deckSlug: String!) {
    studyFlashCard(deckSlug: $deckSlug) {
      id
      template {
        frontSide {
          ...DraftContent
        }
        backSide {
          ...DraftContent
        }
      }
      note {
        id
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

const ANSWER_FLASH_CARD_MUTATION = gql`
  mutation AnswerFlashCard(
    $noteId: ID!
    $flashCardId: ID!
    $answer: FlashCardAnswer!
    $timespan: Int!
  ) {
    answerFlashCard(
      noteId: $noteId
      flashCardId: $flashCardId
      answer: $answer
      timespan: $timespan
    ) {
      id
    }
  }
`

const CancelStudyButton: React.FC = () => {
  const history = useHistory()
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false)

  const handleCancelButtonClick = () => {
    setShowCancelConfirmation(true)
  }

  const handleCloseConfirmationDialog = () => {
    setShowCancelConfirmation(false)
  }

  const handleCancel = () => {
    history.push('/home')
  }

  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <AlertDialog
        isOpen={showCancelConfirmation}
        onDismiss={handleCloseConfirmationDialog}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogLabel>
          <Trans>End study session</Trans>
        </AlertDialogLabel>
        <AlertDialogDescription>
          <Trans>
            Are you sure you want to cancel the current study session?
          </Trans>
        </AlertDialogDescription>
        <div className="flex justify-end">
          <Button onClick={handleCloseConfirmationDialog} ref={cancelRef}>
            <Trans>Continue Studying</Trans>
          </Button>
          <Button className="ml2" onClick={handleCancel}>
            <Trans>End</Trans>
          </Button>
        </div>
      </AlertDialog>
      <Button
        className="flex-shrink-0 ml3 mb3"
        onClick={handleCancelButtonClick}
      >
        <Trans>Cancel</Trans>
      </Button>
    </>
  )
}

const StudyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [queryNextFlashCard, { data, loading }] = useLazyQuery(
    STUDY_CARD_QUERY,
    {
      fetchPolicy: 'network-only',
    }
  )
  const [answerFlashCard, { loading: answerLoading }] = useMutation<
    AnswerFlashCard,
    AnswerFlashCardVariables
  >(ANSWER_FLASH_CARD_MUTATION)

  const [showBackSide, setShowBackSide] = useState(false)

  const getNextFlashCard = useCallback(() => {
    queryNextFlashCard({
      variables: {
        deckSlug: slug,
      },
    })
  }, [queryNextFlashCard, slug])

  const handleAnswer = (answer: FlashCardAnswer) => async () => {
    await answerFlashCard({
      variables: {
        flashCardId: data.studyFlashCard.id,
        noteId: data.studyFlashCard.note.id,
        answer,
        timespan: 0,
      },
    })
    getNextFlashCard()
  }

  useEffect(() => {
    getNextFlashCard()
  }, [getNextFlashCard])

  const handleShowBackSide = () => {
    setShowBackSide(true)
  }

  if (loading || !data) {
    return (
      <div className="h-100 flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }

  return (
    <section className="pt3 pb5 h-100 flex flex-column items-start">
      <CancelStudyButton />

      <div className="self-stretch flex-auto flex flex-column items-center justify-center">
        <FlashCardRenderer
          className="w-100 overflow-auto pt3 ph3 ph4-m ph5-l ph6-xl"
          values={data.studyFlashCard.note.values}
          template={data.studyFlashCard.template}
          hideLabels
          hideBackSide={!showBackSide}
        />
      </div>

      <Portal>
        <div
          className={classnames(
            'z-1 bg-surface h3 fixed bottom-0 w-100 ph3 pv2 shadow-2 flex justify-center items-center'
          )}
        >
          {!showBackSide && (
            <Button onClick={handleShowBackSide}>
              <Trans>Show</Trans>
            </Button>
          )}

          {showBackSide && (
            <div className="w-100 mw6 flex justify-between">
              <Button
                onClick={handleAnswer(FlashCardAnswer.REPEAT)}
                disabled={answerLoading}
              >
                <Trans>Repeat</Trans>
              </Button>
              <Button
                onClick={handleAnswer(FlashCardAnswer.HARD)}
                disabled={answerLoading}
              >
                <Trans>Hard</Trans>
              </Button>
              <Button
                onClick={handleAnswer(FlashCardAnswer.GOOD)}
                disabled={answerLoading}
              >
                <Trans>Good</Trans>
              </Button>
              <Button
                onClick={handleAnswer(FlashCardAnswer.EASY)}
                disabled={answerLoading}
              >
                <Trans>Easy</Trans>
              </Button>
            </div>
          )}
        </div>
      </Portal>
    </section>
  )
}

export default StudyPage
