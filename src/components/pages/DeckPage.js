import React, { useEffect } from 'react'
import { compose, graphql } from 'react-apollo'

import deckQuery from '../../graphql/deckQuery.gql'
import loadingMutation from '../../graphql/topBarLoadingMutation.gql'

const DeckPage = ({ data: { loading, deck }, mutate }) => {
  useEffect(
    () => {
      mutate({ variables: { loading } })
    },
    [loading]
  )

  if (loading) {
    return null
  }
  return <div>{deck.title}</div>
}

export default compose(
  graphql(deckQuery, {
    options: props => ({
      variables: {
        slug: props.match.params.slug,
      },
    }),
  }),
  graphql(loadingMutation)
)(DeckPage)
