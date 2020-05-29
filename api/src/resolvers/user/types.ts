import {
  GraphQLEnumType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

import { graphQLGlobalIdField } from '../../utils/graphqlID'
import { nodeInterface } from '../node/types'

export const UserRolesEnumType = new GraphQLEnumType({
  name: 'UserRoles',
  values: {
    REGULAR: {},
    ADMIN: {},
  },
})

export const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'User entity',
  interfaces: [nodeInterface],
  fields: {
    id: graphQLGlobalIdField(),
    username: {
      type: GraphQLNonNull(GraphQLString),
      description: "User's username",
    },
    email: {
      type: GraphQLNonNull(GraphQLString),
      description: "User's email",
    },
    roles: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(UserRolesEnumType))),
    },
  },
})
