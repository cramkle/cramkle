import { useLazyQuery } from '@apollo/react-hooks'
import { Trans } from '@lingui/macro'
import classnames from 'classnames'
import gql from 'graphql-tag'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'

import FlashCardRenderer from '../FlashCardRenderer'
import Portal from '../Portal'
import Button from '../views/Button'
import CircularProgress from '../views/CircularProgress'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../views/Dialog'

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

const StudyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const history = useHistory()
  const [getNextFlashCard, { data, loading }] = useLazyQuery(STUDY_CARD_QUERY, {
    fetchPolicy: 'network-only',
  })

  const [showBackSide, setShowBackSide] = useState(false)
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false)

  useEffect(() => {
    getNextFlashCard({
      variables: {
        deckSlug: slug,
      },
    })
  }, [getNextFlashCard, slug])

  const handleShowBackSide = () => {
    setShowBackSide(true)
  }

  const handleCancelButtonClick = () => {
    setShowCancelConfirmation(true)
  }

  const handleCloseConfirmationDialog = () => {
    setShowCancelConfirmation(false)
  }

  const handleCancel = () => {
    history.push('/home')
  }

  if (loading || !data) {
    return (
      <div className="h-100 flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }

  return (
    <>
      <Dialog
        open={showCancelConfirmation}
        onClose={handleCloseConfirmationDialog}
        role="alertdialog"
      >
        <DialogTitle>
          <Trans>End study session</Trans>
        </DialogTitle>
        <DialogContent>
          <Trans>
            Are you sure you want to cancel the current study session?
          </Trans>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog}>
            <Trans>Continue Studying</Trans>
          </Button>
          <Button onClick={handleCancel}>
            <Trans>End</Trans>
          </Button>
        </DialogActions>
      </Dialog>
      <section className="pt3 pb5 h-100 flex flex-column items-start">
        <Button
          className="flex-shrink-0 ml3 mb3"
          onClick={handleCancelButtonClick}
        >
          <Trans>Cancel</Trans>
        </Button>

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
                <Button>
                  <Trans>Repeat</Trans>
                </Button>
                <Button>
                  <Trans>Hard</Trans>
                </Button>
                <Button>
                  <Trans>Good</Trans>
                </Button>
                <Button>
                  <Trans>Easy</Trans>
                </Button>
              </div>
            )}
          </div>
        </Portal>
      </section>
    </>
  )
}

export default StudyPage
