import { graphql } from 'graphql'

import gql from '../../../gql'
import schema from '../../../schema'

describe('CreateUser mutation', () => {
  it('createUser successfully creates an user', async () => {
    const query = gql`
      mutation {
        createUser(
          input: {
            username: "lucas"
            email: "lucas@email.com"
            password: "hunter2"
          }
        ) {
          user {
            id
            username
            email
          }
        }
      }
    `

    const result = await graphql({ schema, source: query })

    expect(result.errors).toBeUndefined()
    expect(result.data?.createUser.user.id).toBeTruthy()
    expect(result.data?.createUser.user.username).toBe('lucas')
    expect(result.data?.createUser.user.email).toBe('lucas@email.com')
  })
})
