import { compareAsc, endOfToday, isBefore, startOfToday } from 'date-fns'

import { NoteModel, RevisionLogModel } from '../mongo'
import { FlashCardDocument, FlashCardStatus } from '../mongo/Note'
import { RevisionLogDocument } from '../mongo/RevisionLog'
import { MINIMUM_ANSWER_QUALITY } from './scheduler'

const sumByStatus = (logs: RevisionLogDocument[], status: FlashCardStatus) => {
  return logs
    .filter(
      (log, index, array) =>
        array.findIndex(
          ({ flashCardId }) => log.flashCardId === flashCardId
        ) === index
    )
    .reduce((total, log) => (log.status === status ? total + 1 : total), 0)
}

const MAX_NEW_FLASHCARDS_PER_DAY = 20
const MAX_LEARNING_FLASHCARDS_PER_DAY = 100
const MAX_REVIEW_FLASHCARDS_PER_DAY = 50

const STUDY_LIMIT_BY_STATUS = {
  [FlashCardStatus.NEW]: MAX_NEW_FLASHCARDS_PER_DAY,
  [FlashCardStatus.LEARNING]: MAX_LEARNING_FLASHCARDS_PER_DAY,
  [FlashCardStatus.REVIEW]: MAX_REVIEW_FLASHCARDS_PER_DAY,
}

export const studyFlashCardsByDeck = async (deckId: string) => {
  const todayLogs = await RevisionLogModel.find({
    deckId,
    date: { $gte: startOfToday(), $lte: endOfToday() },
  })

  const finishedFlashCards = todayLogs.filter(
    ({ answerQuality }) => answerQuality >= MINIMUM_ANSWER_QUALITY
  )
  const unfinishedFlashCards = todayLogs.filter(
    (log) =>
      log.answerQuality < MINIMUM_ANSWER_QUALITY &&
      !finishedFlashCards.find((finishedFlashCardLog) =>
        finishedFlashCardLog.flashCardId.equals(log.flashCardId)
      )
  )

  const numOfNew = sumByStatus(todayLogs, FlashCardStatus.NEW)
  const numOfLearning = sumByStatus(todayLogs, FlashCardStatus.LEARNING)
  const numOfReview = sumByStatus(todayLogs, FlashCardStatus.REVIEW)

  const cardCounts = {
    [FlashCardStatus.NEW]: numOfNew,
    [FlashCardStatus.LEARNING]: numOfLearning,
    [FlashCardStatus.REVIEW]: numOfReview,
  }

  const flashCards = (await NoteModel.find({ deckId }))
    .flatMap<FlashCardDocument>((note) => note.flashCards)
    .filter(
      (flashCard) =>
        !flashCard.due ||
        isBefore(flashCard.due, endOfToday()) ||
        !!unfinishedFlashCards.find(({ flashCardId }) =>
          flashCardId.equals(flashCard._id)
        )
    )
    .sort((a, b) => {
      if (!a.due && !b.due) {
        return 0
      }

      if (!a.due) {
        return -1
      }

      if (!b.due) {
        return 1
      }

      return compareAsc(a.due, b.due)
    })
    .filter((flashCard) => {
      const totalOfStudiedUntilNow = cardCounts[flashCard.status]

      if (totalOfStudiedUntilNow == undefined) {
        return false
      }

      const maxPerDay = STUDY_LIMIT_BY_STATUS[flashCard.status]

      if (totalOfStudiedUntilNow < maxPerDay) {
        cardCounts[flashCard.status]++
        return true
      }

      return false
    })

  return flashCards
}
