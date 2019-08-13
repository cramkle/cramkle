import { Application, Request } from 'express'
import { importSchema } from 'graphql-import'
import { ApolloServer, gql } from 'apollo-server-express'

import resolvers from '../resolvers'
import directives from '../directives'

const schema = importSchema('./graphql/schema.graphql')
const typeDefs = gql(schema)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: directives,
  context: ({ req }: { req: Request }): Context => ({
    user: req.user,
  }),
})

export default {
  set: (app: Application) => {
    return server.applyMiddleware({
      app,
    })
  },
}
