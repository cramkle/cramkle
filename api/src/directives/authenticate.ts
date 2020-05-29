import {
  DirectiveLocation,
  GraphQLDirective,
  //GraphQLField,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  //ValidationContext,
  //ASTVisitor,
  //BREAK,
  //GraphQLError,
  //defaultFieldResolver,
} from 'graphql'

export const authenticateDirective = new GraphQLDirective({
  name: 'authenticate',
  description: '',
  locations: [DirectiveLocation.FIELD_DEFINITION],
  args: {
    roles: {
      type: GraphQLNonNull(GraphQLList(GraphQLString)),
      defaultValue: ['REGULAR'],
    },
  },
})

/*
export const validateAuthenticateDirective = (context: ValidationContext) => {
  const visitor: ASTVisitor = {
    Directive: (node) => {
      if (node.name.value !== 'authenticate') {
        return BREAK
      }

      const requiredRoles: string[] = this.args.roles

      const user = context.user

      if (!user) {
        context.reportError(new GraphQLError('User is not authenticated'))
        return BREAK
      }

      const userRoles = user.roles || ['REGULAR']

      if (!requiredRoles.every((role) => userRoles.includes(role))) {
        context.reportError(new GraphQLError("User doesn't have enough access"))
        return BREAK
      }
    },
  }

  return visitor
}
*/

/*
function visitFieldDefinition(field: GraphQLField<any, any>) {
  const { resolve = defaultFieldResolver } = field
  const requiredRoles: string[] = this.args.roles

  field.resolve = function (root, args, context, info) {
    const user = context.user

    if (!user) {
      throw new Error('User is not authenticated')
    }

    const userRoles = user.roles || ['REGULAR']

    if (!requiredRoles.every((role) => userRoles.includes(role))) {
      throw new Error("User doesn't have enough access")
    }

    return resolve.call(this, root, args, context, info)
  }
}
*/
