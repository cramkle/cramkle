import { ApolloError } from 'apollo-server'
import { endOfToday, isBefore, startOfToday } from 'date-fns'
import { IResolverObject } from 'graphql-tools'

import { DeckModel, NoteModel, RevisionLogModel } from '../mongo'
import { FlashCardDocument, FlashCardStatus } from '../mongo/Note'
import { RevisionLogDocument } from '../mongo/RevisionLog'
import {
  FlashCardAnswer,
  MINIMUM_ANSWER_QUALITY,
  answerToQualityValue,
  scheduleFlashCard,
} from '../utils/scheduler'

const sumByStatus = (logs: RevisionLogDocument[], status: FlashCardStatus) => {
  return logs.reduce(
    (total, log) => (log.status === status ? total + 1 : total),
    0
  )
}

export const queries: IResolverObject = {
  studyFlashCard: async (
    _: unknown,
    { deckSlug }: { deckSlug: string },
    ctx: Context
  ) => {
    const deck = await DeckModel.findOne({
      slug: deckSlug,
      ownerId: ctx.user._id,
    })

    if (!deck) {
      throw new ApolloError('Deck not found')
    }

    const todayLogs = await RevisionLogModel.find({
      deckId: deck._id,
      date: { $gte: startOfToday(), $lte: endOfToday() },
      answerQuality: { $gte: MINIMUM_ANSWER_QUALITY },
    })

    const numOfNew = sumByStatus(todayLogs, FlashCardStatus.NEW)
    const numOfLearning = sumByStatus(todayLogs, FlashCardStatus.LEARNING)
    const numOfReview = sumByStatus(todayLogs, FlashCardStatus.REVIEW)

    const flashCards = (await NoteModel.find({ deckId: deck._id }).exec())
      .flatMap<FlashCardDocument>((note) => note.cards)
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

    return flashCards[0]
  },
}

interface AnswerFlashCardArgs {
  noteId: string
  flashCardId: string
  answer: FlashCardAnswer
  timespan: number
}

export const mutations: IResolverObject = {
  answerFlashCard: async (
    _: unknown,
    args: AnswerFlashCardArgs,
    ctx: Context
  ) => {
    const note = await NoteModel.findOne({
      _id: args.noteId,
      ownerId: ctx.user._id,
    })

    const flashCard = note?.cards.id(args.flashCardId)

    if (!note || !flashCard) {
      throw new ApolloError('FlashCard not found')
    }

    // limits the answer timespan to 60 seconds to avoid
    // poluting the statistics when the user gets distracted
    // while studying.
    const timespan = Math.min(args.timespan, 60 * 1000)

    const lastInterval = flashCard.interval
    const status = flashCard.status

    scheduleFlashCard(flashCard, args.answer, timespan)

    await NoteModel.updateOne(
      { _id: note._id, 'cards._id': flashCard._id },
      { $set: { 'cards.$': flashCard } }
    )

    const date = startOfToday()

    await RevisionLogModel.create({
      interval: flashCard.interval,
      lastInterval,
      status,
      answerQuality: answerToQualityValue(args.answer),
      easeFactor: flashCard.easeFactor,
      timespan,
      date,
      ownerId: ctx.user._id,
      noteId: note._id,
      flashCardId: flashCard._id,
    })

    return flashCard
  },
}
