import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import { GraphQLJSON, GraphQLJSONObject } from 'graphql-type-json'

import { createDeck } from './resolvers/deck/createDeck'
import { deck } from './resolvers/deck/deckBySlug'
import { deleteDeck } from './resolvers/deck/deleteDeck'
import { decks } from './resolvers/deck/listDecks'
import { publishDeck, unpublishDeck } from './resolvers/deck/publish'
import { updateDeck } from './resolvers/deck/updateDeck'
import { updateFieldValue } from './resolvers/fieldValue/updateFieldValue'
import { addFieldToModel } from './resolvers/model/addFieldToModel'
import { addTemplateToModel } from './resolvers/model/addTemplateToModel'
import { createModel } from './resolvers/model/createModel'
import { deleteModel } from './resolvers/model/deleteModel'
import { models } from './resolvers/model/listModels'
import { model } from './resolvers/model/modelById'
import { updateModel } from './resolvers/model/updateModel'
import { nodeField, nodeInterface } from './resolvers/node/types'
import { createNote } from './resolvers/note/createNote'
import { deleteNote } from './resolvers/note/deleteNote'
import { note } from './resolvers/note/noteById'
import { answerFlashCard } from './resolvers/study/answerFlashCard'
import { studyFlashCard } from './resolvers/study/studyFlashCard'
import { template } from './resolvers/template/template'
import { updateTemplate } from './resolvers/template/updateTemplate'
import { createUser } from './resolvers/user/createUser'
import { me } from './resolvers/user/me'
import { requestPasswordReset } from './resolvers/user/requestPasswordReset'
import { resetPassword } from './resolvers/user/resetPassword'
import { updateProfile } from './resolvers/user/updateProfile'

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      me: me,
      node: nodeField,
      note: note,
      deck: deck,
      decks: decks,
      models: models,
      model: model,
      template: template,
      studyFlashCard: studyFlashCard,
    } as any,
  }),
  mutation: new GraphQLObjectType<any, Context>({
    name: 'Mutation',
    fields: {
      createDeck: createDeck,
      deleteDeck: deleteDeck,
      updateDeck: updateDeck,
      publishDeck: publishDeck,
      unpublishDeck: unpublishDeck,
      createUser: createUser,
      updateProfile: updateProfile,
      createModel: createModel,
      updateModel: updateModel,
      deleteModel: deleteModel,
      addTemplateToModel: addTemplateToModel,
      updateTemplate: updateTemplate,
      addFieldToModel: addFieldToModel,
      createNote: createNote,
      deleteNote: deleteNote,
      updateFieldValue: updateFieldValue,
      answerFlashCard: answerFlashCard,
      requestPasswordReset: requestPasswordReset,
      resetPassword: resetPassword,
    } as any,
  }),
  types: [GraphQLJSON, GraphQLJSONObject, nodeInterface],
})

export default schema
