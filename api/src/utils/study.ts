import { endOfToday, isBefore, startOfToday } from 'date-fns'

import { NoteModel, RevisionLogModel } from '../mongo'
import { FlashCardDocument, FlashCardStatus } from '../mongo/Note'
import { RevisionLogDocument } from '../mongo/RevisionLog'
import { MINIMUM_ANSWER_QUALITY } from './scheduler'

const sumByStatus = (logs: RevisionLogDocument[], status: FlashCardStatus) => {
  return logs.reduce(
    (total, log) => (log.status === status ? total + 1 : total),
    0
  )
}

export const studyFlashCardsByDeck = async (deckId: string) => {
  const todayLogs = await RevisionLogModel.find({
    deckId,
    date: { $gte: startOfToday(), $lte: endOfToday() },
    answerQuality: { $gte: MINIMUM_ANSWER_QUALITY },
  })

  const numOfNew = sumByStatus(todayLogs, FlashCardStatus.NEW)
  const numOfLearning = sumByStatus(todayLogs, FlashCardStatus.LEARNING)
  const numOfReview = sumByStatus(todayLogs, FlashCardStatus.REVIEW)

  const flashCards = (await NoteModel.find({ deckId }))
    .flatMap<FlashCardDocument>((note) => note.flashCards)
    .filter(
      (flashCard) => !flashCard.due || isBefore(flashCard.due, endOfToday())
    )
    .filter((flashCard) => {
      if (flashCard.status === FlashCardStatus.NEW) {
        return numOfNew < 20
      } else if (flashCard.status === FlashCardStatus.LEARNING) {
        return numOfLearning < 100
      } else if (flashCard.status === FlashCardStatus.REVIEW) {
        return numOfReview < 50
      }
      return false
    })

  return flashCards
}
