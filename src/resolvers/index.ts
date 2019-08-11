import { mapObjIndexed } from 'ramda'
// @ts-ignore typings are outdated
import JSON, { GraphQLJSONObject } from 'graphql-type-json'

import { withAuthentication } from './utils'
import {
  queries as deckQueries,
  root as deckRoot,
  mutations as deckMutations,
} from './deck'
import { queries as noteQueries, root as noteRoot } from './note'
import {
  queries as userQueries,
  root as userRoot,
  mutations as userMutations,
} from './user'
import {
  queries as templateQueries,
  root as templateRoot,
  mutations as templateMutations,
} from './template'
import {
  queries as fieldQueries,
  root as fieldRoot,
  mutations as fieldMutations,
} from './field'
import {
  queries as fieldValueQueries,
  root as fieldValueRoot,
} from './fieldValue'
import { queries as cardQueries, root as cardRoot } from './card'
import {
  queries as cardModelQueries,
  root as cardModelRoot,
  mutations as cardModelMutations,
} from './cardModel'
import {
  root as contentStateRoot,
  mutations as contentStateMutations,
} from './contentState'

export default {
  JSON,
  JSONObject: GraphQLJSONObject,
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
    ...mapObjIndexed(withAuthentication, deckQueries),
    ...mapObjIndexed(withAuthentication, noteQueries),
    ...mapObjIndexed(withAuthentication, templateQueries),
    ...mapObjIndexed(withAuthentication, fieldQueries),
    ...mapObjIndexed(withAuthentication, fieldValueQueries),
    ...mapObjIndexed(withAuthentication, cardQueries),
    ...mapObjIndexed(withAuthentication, cardModelQueries),
    ...userQueries,
  },
  Mutation: {
    ...mapObjIndexed(withAuthentication, deckMutations),
    ...mapObjIndexed(withAuthentication, cardModelMutations),
    ...mapObjIndexed(withAuthentication, templateMutations),
    ...mapObjIndexed(withAuthentication, fieldMutations),
    ...mapObjIndexed(withAuthentication, contentStateMutations),
    ...userMutations,
  },
}
