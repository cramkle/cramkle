import { AuthenticationError } from 'apollo-server'
import { combineResolvers } from 'graphql-resolvers'
import { IFieldResolver } from 'graphql-tools'

export const isAuthenticated: IFieldResolver<any, any> = (_, __, ctx) => {
  if (!ctx.user) {
    return new AuthenticationError('User is not authenticated')
  }
}

export const withAuthentication = (resolver: IFieldResolver<any, any>) =>
  combineResolvers(isAuthenticated, resolver)
