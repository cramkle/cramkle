import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router'
import { compose, graphql, ChildProps } from 'react-apollo'

import deckQuery from '../../graphql/deckQuery.gql'
import loadingMutation from '../../graphql/topBarLoadingMutation.gql'

interface TopbarQueryData {
  topBar: {
    loading: boolean
  }
}

interface DeckOptions {
  slug: string
}

interface DeckData {
  deck: {
    id: string
    slug: string
    title: string
    description: string
  }
}

interface Data extends TopbarQueryData, DeckData {}

const DeckPage: React.FunctionComponent<
  ChildProps<RouteComponentProps, Data>
> = ({ data: { loading, deck }, mutate }) => {
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
  graphql<RouteComponentProps, DeckData, DeckOptions>(deckQuery, {
    options: props => ({
      variables: {
        // gambs 🤷
        slug: (props.match.params as { slug: string }).slug,
      },
    }),
  }),
  graphql<RouteComponentProps, TopbarQueryData>(loadingMutation)
)(DeckPage)
