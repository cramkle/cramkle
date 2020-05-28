import { GraphQLID, GraphQLInt } from 'graphql'
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay'

import { NoteModel, RevisionLogModel } from '../../mongo'
import {
  FlashCardAnswer,
  answerToQualityValue,
  scheduleFlashCard,
} from '../../utils/scheduler'
import { FlashCardType } from '../flashCard/types'
import { FlashCardAnswerEnumType } from './types'

interface AnswerFlashCardArgs {
  noteId: string
  flashCardId: string
  answer: FlashCardAnswer
  timespan: number
}

export const answerFlashCard = mutationWithClientMutationId({
  name: 'AnswerFlashCard',
  description:
    'Records an answer to the flashcard during the study session and re-schedules it to a future date.',
  inputFields: {
    noteId: { type: GraphQLID, description: 'Id of the flashcard note' },
    flashCardId: { type: GraphQLID, description: 'Id of the flashcard' },
    answer: { type: FlashCardAnswerEnumType, description: 'Answer value' },
    timespan: {
      type: GraphQLInt,
      description: 'Time the user took to answer in milliseconds',
    },
  },
  outputFields: { flashCard: { type: FlashCardType } },
  mutateAndGetPayload: async (args: AnswerFlashCardArgs, ctx) => {
    const { id: noteId } = fromGlobalId(args.noteId)
    const { id: flashCardId } = fromGlobalId(args.flashCardId)

    const note = await NoteModel.findOne({
      _id: noteId,
      ownerId: ctx.user!._id,
    })

    const flashCard = note?.flashCards.id(flashCardId)

    if (!note || !flashCard) {
      throw new Error('FlashCard not found')
    }

    // limits the answer timespan to 60 seconds to avoid
    // poluting the statistics when the user gets distracted
    // while studying.
    const timespan = Math.min(args.timespan, 60 * 1000)

    const lastInterval = flashCard.interval
    const status = flashCard.status

    scheduleFlashCard(flashCard, args.answer, timespan)

    await NoteModel.updateOne(
      { _id: note._id, 'flashCards._id': flashCard._id },
      { $set: { 'flashCards.$': flashCard } }
    )

    await RevisionLogModel.create({
      interval: flashCard.interval,
      lastInterval,
      status,
      answerQuality: answerToQualityValue(args.answer),
      easeFactor: flashCard.easeFactor,
      timespan,
      date: new Date(),
      ownerId: ctx.user!._id,
      noteId: note._id,
      flashCardId: flashCard._id,
      deckId: note.deckId,
    })

    return { flashCard }
  },
})
