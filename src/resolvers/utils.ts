import { Model, Document } from 'mongoose'
import { map } from 'ramda'
import { AuthenticationError } from 'apollo-server'
import { combineResolvers } from 'graphql-resolvers'
import { IFieldResolver } from 'graphql-tools'

export function findRefFromList<T extends Document>(
  model: Model<T>,
  refList: string[]
) {
  return map(id => model.findById(id), refList)
}

export const isAuthenticated: IFieldResolver<any, any> = (_, __, ctx) => {
  if (!ctx.user) {
    return new AuthenticationError('User is not authenticated')
  }
}

export const withAuthentication = (resolver: IFieldResolver<any, any>) =>
  combineResolvers(isAuthenticated, resolver)
