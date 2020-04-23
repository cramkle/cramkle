import { ApolloError } from 'apollo-server'
import { IResolverObject } from 'graphql-tools'

import { DeckModel, NoteModel } from '../mongo'
import { FlashCardDocument } from '../mongo/Note'
import { scheduleFlashCard } from '../utils/scheduler'

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

    console.log(flashCards)

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
      'cards._id': args.flashCardId,
      ownerId: ctx.user._id,
    })

    const flashCard = note?.cards.id(args.flashCardId)

    if (!note || !flashCard) {
      throw new ApolloError('FlashCard not found')
    }

    scheduleFlashCard(flashCard, args.answer, args.timespan)

    await NoteModel.updateOne(
      { _id: note._id, 'cards._id': flashCard._id },
      { $set: { 'cards.$': flashCard } }
    )

    return flashCard
  },
}
