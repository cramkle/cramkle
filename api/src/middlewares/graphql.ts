import { Application, Request } from 'express'
import graphqlHTTP from 'express-graphql'

import schema from '../schema'

export default {
  set: (app: Application) => {
    app.use(
      '/graphql',
      graphqlHTTP((request) => {
        return {
          schema,
          graphiql: true,
          context: {
            user: (request as Request).user,
          },
        }
      })
    )
  },
}
