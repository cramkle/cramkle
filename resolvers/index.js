const {
  queries: deckQueries,
  root: deckRoot,
  mutations: deckMutations,
} = require('./deck')
const { queries: noteQueries, root: noteRoot } = require('./note')
const {
  queries: userQueries,
  root: userRoot,
  mutations: userMutations,
} = require('./user')
const { queries: templateQueries, root: templateRoot } = require('./template')
const { queries: fieldQueries, root: fieldRoot } = require('./field')
const {
  queries: fieldValueQueries,
  root: fieldValueRoot,
} = require('./fieldValue')
const { queries: cardQueries, root: cardRoot } = require('./card')
const {
  queries: cardModelQueries,
  root: cardModelRoot,
} = require('./cardModel')

module.exports = {
  ...deckRoot,
  ...noteRoot,
  ...templateRoot,
  ...fieldRoot,
  ...fieldValueRoot,
  ...cardRoot,
  ...cardModelRoot,
  ...userRoot,
  Query: {
    ...deckQueries,
    ...noteQueries,
    ...templateQueries,
    ...fieldQueries,
    ...fieldValueQueries,
    ...cardQueries,
    ...cardModelQueries,
    ...userQueries,
  },
  Mutation: {
    ...deckMutations,
    ...userMutations,
  },
}
