import { FlashCard, FlashCardStatus } from '../mongo/Note'

const _scheduleLearning = (_: FlashCard, __: FlashCardAnswer) => {
  // TODO
}

const _scheduleReview = (flashCard: FlashCard, answer: FlashCardAnswer) => {
  if (answer === FlashCardAnswer.REPEAT) {
    flashCard.lapses += 1
    // user forgot the answer, should learn again
    flashCard.status = FlashCardStatus.LEARNING
  }
}

const _scheduleNew = (flashCard: FlashCard) => {
  // for new flashcards, we don't need the answer because
  // they are automatically converted to a learning card regardless
  flashCard.status = FlashCardStatus.LEARNING
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

  if (flashCard.status === FlashCardStatus.NEW) {
    _scheduleNew(flashCard)
  } else if (flashCard.status === FlashCardStatus.LEARNING) {
    _scheduleLearning(flashCard, answer)
  } else if (flashCard.status === FlashCardStatus.REVIEW) {
    _scheduleReview(flashCard, answer)
  }
}
