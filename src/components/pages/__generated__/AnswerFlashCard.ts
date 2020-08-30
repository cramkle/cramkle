/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FlashCardAnswer } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: AnswerFlashCard
// ====================================================

export interface AnswerFlashCard_answerFlashCard_flashCard {
  __typename: "FlashCard";
  /**
   * The ID of an object
   */
  id: string;
}

export interface AnswerFlashCard_answerFlashCard {
  __typename: "AnswerFlashCardPayload";
  flashCard: AnswerFlashCard_answerFlashCard_flashCard;
}

export interface AnswerFlashCard {
  /**
   * Records an answer to the flashcard during the study session and re-schedules it to a future date.
   */
  answerFlashCard: AnswerFlashCard_answerFlashCard | null;
}

export interface AnswerFlashCardVariables {
  noteId: string;
  flashCardId: string;
  answer: FlashCardAnswer;
  timespan: number;
}
