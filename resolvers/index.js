const { mapObjIndexed } = require('ramda')
const { AuthenticationError } = require('apollo-server')

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

const withAuthentication = resolver => (root, args, ctx, info) => {
  if (!ctx.user) {
    throw new AuthenticationError()
  }

  return resolver(root, args, ctx, info)
}

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
