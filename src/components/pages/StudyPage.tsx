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
import { Headline2 } from '../views/Typography'
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
      input: {
        noteId: $noteId
        flashCardId: $flashCardId
        answer: $answer
        timespan: $timespan
      }
    ) {
      flashCard {
        id
      }
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
          <Button className="ml-2" onClick={handleCancel}>
            <Trans>End</Trans>
          </Button>
        </div>
      </AlertDialog>
      <Button
        className="flex-shrink-0 ml-4 mb-4"
        onClick={handleCancelButtonClick}
      >
        <Trans>Cancel</Trans>
      </Button>
    </>
  )
}

const StudyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [startTime, setStartTime] = useState(0)
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

  useEffect(() => {
    if (loading) {
      setShowBackSide(false)
    }

    if (!loading) {
      setStartTime(Date.now())
    }
  }, [loading])

  const handleAnswer = (answer: FlashCardAnswer) => async () => {
    const now = Date.now()

    await answerFlashCard({
      variables: {
        flashCardId: data.studyFlashCard.id,
        noteId: data.studyFlashCard.note.id,
        answer,
        timespan: now - startTime,
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

  const history = useHistory()

  const handleGoHomeClick = () => {
    history.push('/home')
  }

  if (loading || !data) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <CircularProgress />
      </div>
    )
  }

  if (data.studyFlashCard === null) {
    return (
      <section className="h-full flex flex-col items-center justify-center bg-background">
        <Headline2 className="text-xl text-center leading-none text-primary">
          <Trans>
            Congratulations, you have finished studying this deck for now.
          </Trans>
        </Headline2>
        <Button className="mt-4" onClick={handleGoHomeClick}>
          <Trans>Go to Home</Trans>
        </Button>
      </section>
    )
  }

  return (
    <section className="min-h-full pt-4 pb-16 flex flex-col items-start bg-background">
      <CancelStudyButton />

      <div className="self-stretch flex-auto flex flex-col items-center justify-center">
        <FlashCardRenderer
          className="w-full overflow-auto pt-4 px-4 md:px-8 lg:px-16 xl:px-32"
          values={data.studyFlashCard.note.values}
          template={data.studyFlashCard.template}
          hideLabels
          hideBackSide={!showBackSide}
        />
      </div>

      <Portal>
        <div
          className={classnames(
            'z-10 bg-surface h-16 fixed bottom-0 w-full px-4 py-2 flex justify-center items-center'
          )}
          style={{
            boxShadow:
              '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
        >
          {!showBackSide && (
            <Button onClick={handleShowBackSide}>
              <Trans>Show</Trans>
            </Button>
          )}

          {showBackSide && (
            <div className="w-full max-w-lg flex justify-between">
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
