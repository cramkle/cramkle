import { Body1, Headline4 } from '@material/react-typography'
import React, { useEffect } from 'react'
import { compose, graphql, ChildProps } from 'react-apollo'
import { Helmet } from 'react-helmet'
import { RouteComponentProps } from 'react-router'

import BackButton from '../BackButton'
import DeleteDeckButton from '../DeleteDeckButton'
import deckQuery from '../../graphql/deckQuery.gql'
import {
  DeckQuery,
  DeckQueryVariables,
} from '../../graphql/__generated__/DeckQuery'
import loadingMutation from '../../graphql/topBarLoadingMutation.gql'
import {
  SetLoadingMutation,
  SetLoadingMutationVariables,
} from '../../graphql/__generated__/SetLoadingMutation'

type Props = RouteComponentProps<{ slug: string }>

type Data = DeckQuery & SetLoadingMutation

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
        <BackButton />
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
  graphql<Props, DeckQuery, DeckQueryVariables>(deckQuery, {
    options: props => ({
      variables: {
        slug: props.match.params.slug,
      },
    }),
  }),
  graphql<Props, SetLoadingMutation, SetLoadingMutationVariables>(
    loadingMutation
  )
)(DeckPage)
