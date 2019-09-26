import { useQuery } from '@apollo/react-hooks'
import { Body1, Headline4 } from 'views/Typography'
import gql from 'graphql-tag'
import React from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router'

import { DeckQuery, DeckQueryVariables } from './__generated__/DeckQuery'
import BackButton from 'components/BackButton'
import DeleteDeckButton from 'components/DeleteDeckButton'
import Container from 'views/Container'
import useTopBarLoading from 'hooks/useTopBarLoading'

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

const DeckPage: React.FunctionComponent = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data, loading } = useQuery<DeckQuery, DeckQueryVariables>(
    DECK_QUERY,
    {
      variables: { slug },
    }
  )

  useTopBarLoading(loading)

  if (loading) {
    return null
  }

  const { deck } = data

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

export default DeckPage
