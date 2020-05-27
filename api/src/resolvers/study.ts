import { IResolverObject } from 'graphql-tools'

import { DeckModel, NoteModel, RevisionLogModel } from '../mongo'
import { decodeGlobalId } from '../utils/graphqlID'
import {
  FlashCardAnswer,
  answerToQualityValue,
  scheduleFlashCard,
} from '../utils/scheduler'
import { studyFlashCardsByDeck } from '../utils/study'

export const queries: IResolverObject = {
  studyFlashCard: async (
    _: unknown,
    { deckSlug }: { deckSlug: string },
    ctx: Context
  ) => {
    const deck = await DeckModel.findOne({
      slug: deckSlug,
      ownerId: ctx.user!._id,
    })

    if (!deck) {
      throw new Error('Deck not found')
    }

    const flashCards = await studyFlashCardsByDeck(deck._id)

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
    const { objectId: noteId } = decodeGlobalId(args.noteId)
    const { objectId: flashCardId } = decodeGlobalId(args.flashCardId)

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

    return flashCard
  },
}
