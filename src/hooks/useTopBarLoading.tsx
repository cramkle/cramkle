import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useEffect } from 'react'

import type {
  SetLoadingMutation,
  SetLoadingMutationVariables,
} from './__generated__/SetLoadingMutation'

export const LOADING_MUTATION = gql`
  mutation SetLoadingMutation($loading: Boolean) {
    setTopBarLoading(loading: $loading) @client
  }
`

export const useTopBarLoading = (loading: boolean) => {
  const [mutate] = useMutation<SetLoadingMutation, SetLoadingMutationVariables>(
    LOADING_MUTATION
  )

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      return
    }

    mutate({ variables: { loading } })
  }, [loading, mutate])
}
