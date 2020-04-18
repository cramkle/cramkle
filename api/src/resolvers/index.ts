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
import {
  mutations as fieldValueMutations,
  root as fieldValueRoot,
} from './fieldValue'
import { root as flashCardRoot } from './flashCard'
import {
  mutations as modelMutations,
  queries as modelQueries,
  root as modelRoot,
} from './model'
import { root as contentStateRoot } from './contentState'

export default {
  JSON,
  JSONObject,
  ...deckRoot,
  ...noteRoot,
  ...templateRoot,
  ...fieldRoot,
  ...fieldValueRoot,
  ...flashCardRoot,
  ...modelRoot,
  ...userRoot,
  ...contentStateRoot,
  Query: {
    ...deckQueries,
    ...noteQueries,
    ...templateQueries,
    ...modelQueries,
    ...userQueries,
  },
  Mutation: {
    ...deckMutations,
    ...modelMutations,
    ...templateMutations,
    ...userMutations,
    ...noteMutations,
    ...fieldValueMutations,
  },
}
