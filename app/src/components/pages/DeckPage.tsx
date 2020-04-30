import { useQuery } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import gql from 'graphql-tag'
import React from 'react'
import { Helmet } from 'react-helmet'
import { useHistory, useParams } from 'react-router'

import useTopBarLoading from '../../hooks/useTopBarLoading'
import BackButton from '../BackButton'
import DeleteDeckButton from '../DeleteDeckButton'
import { useHints } from '../HintsContext'
import NotesTable from '../NotesTable'
import Container from '../views/Container'
import Fab from '../views/Fab'
import Icon from '../views/Icon'
import { Body1, Headline4, Headline5, Headline6 } from '../views/Typography'
import { DeckQuery, DeckQueryVariables } from './__generated__/DeckQuery'

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
          id
          data {
            ...DraftContent
          }
          field {
            id
            name
          }
        }
        model {
          name
          primaryField {
            id
          }
        }
        flashCards {
          id
          active
          state
          due
          template {
            name
          }
        }
        deck {
          title
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
        <BackButton to="/decks" />

        <div className="flex flex-col mb-8">
          <div className="flex justify-between items-center">
            <Headline4>
              <Trans>Deck details</Trans>
            </Headline4>

            <DeleteDeckButton deckId={deck.id} />
          </div>
          <Headline5 className="mt-4">{deck.title}</Headline5>
          {deck.description && (
            <Body1 className="mt-1">{deck.description}</Body1>
          )}
        </div>

        <Headline6 className="font-medium">
          <Trans>Notes</Trans>
        </Headline6>

        <div className="my-8">
          <NotesTable notes={deck.notes} deckSlug={deck.slug} />
        </div>

        {!isMobile && (
          <div className="fixed" style={{ bottom: 20, right: 20 }}>
            <Fab
              icon={<Icon icon="add" aria-hidden="true" />}
              aria-label={i18n._(t`Add Note`)}
              textLabel={i18n._(t`Add Note`)}
              onClick={() => history.push(`${location.pathname}/new-note`)}
            />
          </div>
        )}
      </Container>
    </>
  )
}

export default DeckPage
