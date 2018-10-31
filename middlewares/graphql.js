const { importSchema } = require('graphql-import')
const { ApolloServer, gql } = require('apollo-server-express')

const schema = importSchema('./graphql/schema.graphql')
const typeDefs = gql(schema)
const resolvers = require('../resolvers')

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

module.exports = {
  set: app => {
    return server.applyMiddleware({ app })
  },
}
