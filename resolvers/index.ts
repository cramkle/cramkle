import { mapObjIndexed } from 'ramda'

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
import { queries as templateQueries, root as templateRoot } from './template'
import { queries as fieldQueries, root as fieldRoot } from './field'
import {
  queries as fieldValueQueries,
  root as fieldValueRoot,
} from './fieldValue'
import { queries as cardQueries, root as cardRoot } from './card'
import { queries as cardModelQueries, root as cardModelRoot } from './cardModel'

export default {
  ...deckRoot,
  ...noteRoot,
  ...templateRoot,
  ...fieldRoot,
  ...fieldValueRoot,
  ...cardRoot,
  ...cardModelRoot,
  ...userRoot,
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
    ...userMutations,
  },
}
