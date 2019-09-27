import {
  AuthenticationError,
  ForbiddenError,
  SchemaDirectiveVisitor,
} from 'apollo-server'
import { GraphQLField, defaultFieldResolver } from 'graphql'

export default class AuthenticateDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<any, any>) {
    const { resolve = defaultFieldResolver } = field
    const requiredRoles: string[] = this.args.roles

    field.resolve = function(root, args, context, info) {
      const user = context.user

      if (!user) {
        return new AuthenticationError('User is not authenticated')
      }

      const userRoles = user.roles || ['REGULAR']

      if (!requiredRoles.every(role => userRoles.includes(role))) {
        return new ForbiddenError("User doesn't have enough access")
      }

      return resolve.call(this, root, args, context, info)
    }
  }
}
