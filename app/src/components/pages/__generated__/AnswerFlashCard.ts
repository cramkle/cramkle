/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FlashCardAnswer } from './../../../globalTypes'

// ====================================================
// GraphQL mutation operation: AnswerFlashCard
// ====================================================

export interface AnswerFlashCard_answerFlashCard {
  __typename: 'FlashCard'
  /**
   * FlashCard id.
   */
  id: string
}

export interface AnswerFlashCard {
  answerFlashCard: AnswerFlashCard_answerFlashCard
}

export interface AnswerFlashCardVariables {
  noteId: string
  flashCardId: string
  answer: FlashCardAnswer
  timespan: number
}
