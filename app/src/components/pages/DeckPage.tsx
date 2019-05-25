import { useQuery } from '@apollo/react-hooks'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Body1, Headline4 } from 'views/Typography'
import gql from 'graphql-tag'
import React from 'react'
import { Helmet } from 'react-helmet'
import { useHistory, useParams } from 'react-router'

import { DeckQuery, DeckQueryVariables } from './__generated__/DeckQuery'
import NotesTable from 'components/NotesTable'
import BackButton from 'components/BackButton'
import DeleteDeckButton from 'components/DeleteDeckButton'
import { useHints } from 'components/HintsContext'
import Container from 'views/Container'
import useTopBarLoading from 'hooks/useTopBarLoading'
import Icon from 'views/Icon'
import Fab from 'views/Fab'

const DECK_QUERY = gql`
  query DeckQuery($slug: String!) {
    deck(slug: $slug) {
      id
      slug
      title
      description
      notes {
        id
        values {
          data {
            ...DraftContent
          }
        }
        model {
          name
        }
      }
    }
  }

  fragment DraftContent on ContentState {
    id
    blocks {
      key
      type
      text
      depth
      inlineStyleRanges {
        style
        offset
        length
      }
      entityRanges {
        key
        length
        offset
      }
      data
    }
    entityMap
  }
`

const DeckPage: React.FunctionComponent = () => {
  const { isMobile } = useHints()
  const { i18n } = useLingui()
  const { slug } = useParams<{ slug: string }>()
  const history = useHistory()
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

        <NotesTable notes={deck.notes} />

        <div className="fixed" style={{ bottom: 20, right: 20 }}>
          <Fab
            icon={<Icon icon="add" aria-hidden="true" />}
            aria-label={i18n._(t`Add Note`)}
            textLabel={!isMobile && i18n._(t`Add Note`)}
            onClick={() => history.push(`${location.pathname}/new-note`)}
          />
        </div>
      </Container>
    </>
  )
}

export default DeckPage
