import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useEffect } from 'react'

import {
  SetLoadingMutation,
  SetLoadingMutationVariables,
} from './__generated__/SetLoadingMutation'

const LOADING_MUTATION = gql`
  mutation SetLoadingMutation($loading: Boolean) {
    setTopBarLoading(loading: $loading) @client
  }
`

const useTopBarLoading = (loading: boolean) => {
  const [mutate] = useMutation<SetLoadingMutation, SetLoadingMutationVariables>(
    LOADING_MUTATION
  )

  useEffect(() => {
    mutate({ variables: { loading } })
  }, [loading, mutate])
}

export default useTopBarLoading
