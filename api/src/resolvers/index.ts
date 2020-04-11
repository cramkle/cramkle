// @ts-ignore typings are outdated
import JSON, { GraphQLJSONObject as JSONObject } from 'graphql-type-json'

import {
  mutations as deckMutations,
  queries as deckQueries,
  root as deckRoot,
} from './deck'
import {
  mutations as noteMutations,
  queries as noteQueries,
  root as noteRoot,
} from './note'
import {
  mutations as userMutations,
  queries as userQueries,
  root as userRoot,
} from './user'
import {
  mutations as templateMutations,
  queries as templateQueries,
  root as templateRoot,
} from './template'
import { root as fieldRoot } from './field'
import { root as fieldValueRoot } from './fieldValue'
import { root as cardRoot } from './card'
import {
  mutations as cardModelMutations,
  queries as cardModelQueries,
  root as cardModelRoot,
} from './cardModel'
import { root as contentStateRoot } from './contentState'

export default {
  JSON,
  JSONObject,
  ...deckRoot,
  ...noteRoot,
  ...templateRoot,
  ...fieldRoot,
  ...fieldValueRoot,
  ...cardRoot,
  ...cardModelRoot,
  ...userRoot,
  ...contentStateRoot,
  Query: {
    ...deckQueries,
    ...noteQueries,
    ...templateQueries,
    ...cardModelQueries,
    ...userQueries,
  },
  Mutation: {
    ...deckMutations,
    ...cardModelMutations,
    ...templateMutations,
    ...userMutations,
    ...noteMutations,
  },
}
