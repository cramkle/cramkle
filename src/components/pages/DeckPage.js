import React from 'react'
import { graphql } from 'react-apollo'

import deckQuery from '../../graphql/deckQuery.gql'

const DeckPage = ({ data: { loading, deck } }) => {
  if (loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      {deck.title}
    </div>
  )
}

export default graphql(deckQuery, {
  options: props => ({
    variables: {
      slug: props.match.params.slug,
    },
  }),
})(DeckPage)
