import { ApolloError } from 'apollo-server'
import { startOfToday } from 'date-fns'
import { IResolverObject } from 'graphql-tools'

import { DeckModel, NoteModel, RevisionLogModel } from '../mongo'
import { FlashCardDocument } from '../mongo/Note'
import {
  FlashCardAnswer,
  answerToQualityValue,
  scheduleFlashCard,
} from '../utils/scheduler'

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

    const flashCards = (
      await NoteModel.find({ deckId: deck._id }).exec()
    ).flatMap<FlashCardDocument>((note) => note.cards)

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
