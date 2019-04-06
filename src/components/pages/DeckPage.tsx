import { Body1, Headline4 } from '@material/react-typography'
import React, { useEffect } from 'react'
import { compose, graphql, ChildProps } from 'react-apollo'
import { Helmet } from 'react-helmet'
import { RouteComponentProps } from 'react-router'

import DeleteDeckButton from '../DeleteDeckButton'
import deckQuery from '../../graphql/deckQuery.gql'
import loadingMutation from '../../graphql/topBarLoadingMutation.gql'

interface TopbarQueryData {
  topBar: {
    loading: boolean
  }
}

interface DeckData {
  deck: {
    id: string
    slug: string
    title: string
    description: string
  }
}

type Props = RouteComponentProps<{ slug: string }>

interface Data extends TopbarQueryData, DeckData {}

const DeckPage: React.FunctionComponent<ChildProps<Props, Data>> = ({
  data: { loading, deck },
  mutate,
}) => {
  useEffect(() => {
    mutate({ variables: { loading } })
  }, [loading, mutate])

  if (loading) {
    return null
  }

  return (
    <>
      <Helmet title={deck.title} />
      <div className="pa3 ph4-m ph6-l">
        <div className="flex flex-wrap justify-between items-center">
          <Headline4>{deck.title}</Headline4>

          <DeleteDeckButton deckId={deck.id} />
        </div>
        <Body1>{deck.description}</Body1>
      </div>
    </>
  )
}

export default compose(
  graphql<Props, DeckData, { slug: string }>(deckQuery, {
    options: props => ({
      variables: {
        slug: props.match.params.slug,
      },
    }),
  }),
  graphql<Props, TopbarQueryData>(loadingMutation)
)(DeckPage)
