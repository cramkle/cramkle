import JSON, { GraphQLJSONObject as JSONObject } from 'graphql-type-json'

import { root as contentStateRoot } from './contentState'
import {
  mutations as deckMutations,
  queries as deckQueries,
  root as deckRoot,
} from './deck'
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
import { resolvers as nodeResolvers, root as nodeRoot } from './node'
import {
  mutations as noteMutations,
  queries as noteQueries,
  root as noteRoot,
} from './note'
import { mutations as studyMutations, queries as studyQueries } from './study'
import {
  mutations as templateMutations,
  queries as templateQueries,
  root as templateRoot,
} from './template'
import {
  mutations as userMutations,
  queries as userQueries,
  root as userRoot,
} from './user'

export default {
  JSON,
  JSONObject,
  ...contentStateRoot,
  ...deckRoot,
  ...fieldRoot,
  ...fieldValueRoot,
  ...flashCardRoot,
  ...modelRoot,
  ...nodeRoot,
  ...noteRoot,
  ...templateRoot,
  ...userRoot,
  Query: {
    ...deckQueries,
    ...modelQueries,
    ...nodeResolvers,
    ...noteQueries,
    ...studyQueries,
    ...templateQueries,
    ...userQueries,
  },
  Mutation: {
    ...deckMutations,
    ...fieldValueMutations,
    ...modelMutations,
    ...noteMutations,
    ...studyMutations,
    ...templateMutations,
    ...userMutations,
  },
}
