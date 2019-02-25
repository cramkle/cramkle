import { Application, Request } from 'express'
import { importSchema } from 'graphql-import'
import { ApolloServer, gql } from 'apollo-server-express'
import resolvers from '../resolvers'

const schema = importSchema('./graphql/schema.graphql')
const typeDefs = gql(schema)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }: { req: Request }) => ({
    user: req.user,
  }),
})

export default {
  set: (app: Application) => {
    return server.applyMiddleware({
      app,
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
    })
  },
}
