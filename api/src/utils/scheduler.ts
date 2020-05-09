import { addDays } from 'date-fns'

import { FlashCard, FlashCardStatus } from '../mongo/Note'

export const MINIMUM_ANSWER_QUALITY = 3

export enum FlashCardAnswer {
  REPEAT = 'REPEAT',
  HARD = 'HARD',
  GOOD = 'GOOD',
  EASY = 'EASY',
}

const _calculateNextInterval = (reps: number, easeFactor: number): number => {
  if (reps === 0) {
    throw new Error("Cannot calculate next interval when 'reps' is zero.")
  }

  if (reps === 1) {
    return 1
  } else if (reps === 2) {
    return 6
  }

  return Math.ceil(_calculateNextInterval(reps - 1, easeFactor) * easeFactor)
}

export const answerToQualityValue = (answer: FlashCardAnswer): number => {
  switch (answer) {
    case FlashCardAnswer.REPEAT:
      return 0
    case FlashCardAnswer.HARD:
      return 3
    case FlashCardAnswer.GOOD:
      return 4
    case FlashCardAnswer.EASY:
      return 5
    default:
      throw new Error(`Unknown answer ${answer}`)
  }
}

/**
 * Calculates the next E-Factor (or easeFactor)
 * given the current answer.
 */
const _calculateNextEaseFactor = (
  easeFactor: number,
  answerQuality: number
) => {
  return Math.max(
    // The easeFactor should never be below 130% (1.3), as a SuperMemo
    // research found that the flashCards can become due more often than
    // is useful and annoy users
    1.3,
    easeFactor +
      (0.1 - (5 - answerQuality) * (0.08 + (5 - answerQuality) * 0.02))
  )
}

/**
 * Schedules the flashcard based on the answer
 * of the study session.
 */
export const scheduleFlashCard = (
  flashCard: FlashCard,
  answer: FlashCardAnswer,
  _: number
) => {
  flashCard.reviews += 1

  const responseQuality = answerToQualityValue(answer)

  flashCard.easeFactor = _calculateNextEaseFactor(
    flashCard.easeFactor ?? 2.5,
    responseQuality
  )

  if (responseQuality < MINIMUM_ANSWER_QUALITY) {
    flashCard.reviews = 1
  }

  flashCard.interval = _calculateNextInterval(
    flashCard.reviews,
    flashCard.easeFactor
  )

  flashCard.due = addDays(new Date(), flashCard.interval)

  if (flashCard.reviews === 0) {
    flashCard.status = FlashCardStatus.NEW
  } else {
    flashCard.status = FlashCardStatus.LEARNING
  }
}
