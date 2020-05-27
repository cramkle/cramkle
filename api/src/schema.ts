import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import { GraphQLJSON, GraphQLJSONObject } from 'graphql-type-json'

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {} as any,
  }),
  mutation: new GraphQLObjectType<any, Context>({
    name: 'Mutation',
    fields: {} as any,
  }),
  types: [GraphQLJSON, GraphQLJSONObject],
})

export default schema
