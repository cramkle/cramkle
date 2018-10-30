const { importSchema } = require('graphql-import')
const { ApolloServer, gql } = require('apollo-server')
const { registerServer } = require('apollo-server-express')

const typeDefs = gql(importSchema('./graphql/schema.gql'))
const resolvers = require('../resolvers')

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

module.exports = {
  set: app => { // eslint-disable-line no-unused-vars
    return registerServer(server)
  },
}
