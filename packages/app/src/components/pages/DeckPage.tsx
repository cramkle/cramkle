import { Body1, Headline4 } from '@material/react-typography'
import gql from 'graphql-tag'
import React, { useEffect } from 'react'
import { ChildProps, compose, graphql } from 'react-apollo'
import { Helmet } from 'react-helmet'
import { RouteComponentProps } from 'react-router'

import { DeckQuery, DeckQueryVariables } from './__generated__/DeckQuery'
import BackButton from '../BackButton'
import DeleteDeckButton from '../DeleteDeckButton'
import Container from '../views/Container'
import loadingMutation from '../../graphql/topBarLoadingMutation.gql'
import {
  SetLoadingMutation,
  SetLoadingMutationVariables,
} from '../../graphql/__generated__/SetLoadingMutation'

type Props = RouteComponentProps<{ slug: string }>

type Data = DeckQuery & SetLoadingMutation

const DECK_QUERY = gql`
  query DeckQuery($slug: String!) {
    deck(slug: $slug) {
      id
      slug
      title
      description
    }
  }
`

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
      <Container>
        <BackButton />
        <div className="flex flex-wrap justify-between items-center">
          <Headline4>{deck.title}</Headline4>

          <DeleteDeckButton deckId={deck.id} />
        </div>
        <Body1>{deck.description}</Body1>
      </Container>
    </>
  )
}

export default compose(
  graphql<Props, DeckQuery, DeckQueryVariables>(DECK_QUERY, {
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
