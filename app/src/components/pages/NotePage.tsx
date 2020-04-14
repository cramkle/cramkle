import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { RawDraftContentState, convertFromRaw } from 'draft-js'
import React from 'react'
import { useParams } from 'react-router'
import { Helmet } from 'react-helmet'

import useTopBarLoading from 'hooks/useTopBarLoading'
import Container from 'views/Container'
import BackButton from 'components/BackButton'
import { Headline4 } from 'views/Typography'
import { NoteQuery, NoteQueryVariables } from './__generated__/NoteQuery'

const NOTE_QUERY = gql`
  query NoteQuery($noteId: ID!) {
    note(id: $noteId) {
      id
      deck {
        title
      }
      model {
        primaryField {
          id
        }
      }
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

const NotePage: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>()
  const { data, loading } = useQuery<NoteQuery, NoteQueryVariables>(
    NOTE_QUERY,
    { variables: { noteId } }
  )

  useTopBarLoading(loading)

  if (loading) {
    return null
  }

  const {
    note: {
      id,
      values,
      deck,
      model: { primaryField },
    },
  } = data

  const contentState = convertFromRaw(
    values.find((value) => value.field.id === primaryField?.id)
      ?.data as RawDraftContentState
  )

  const noteIdentifier = contentState?.getPlainText() ?? id

  return (
    <>
      <Helmet title={deck.title} />
      <Container>
        <BackButton />

        <div className="flex justify-between">
          <Headline4>
            Note "{noteIdentifier}" of Deck {deck.title}
          </Headline4>
        </div>
      </Container>
    </>
  )
}

export default NotePage
