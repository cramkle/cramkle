import { useMutation, useQuery } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import gql from 'graphql-tag'
import React, { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router'

import BackButton from 'components/BackButton'
import FieldValueEditor from 'components/FieldValueEditor'
import Button from 'views/Button'
import Container from 'views/Container'
import { Body2, Caption, Headline5, Subtitle1 } from 'views/Typography'
import useTopBarLoading from 'hooks/useTopBarLoading'
import {
  NoteFormQuery,
  NoteFormQueryVariables,
} from './__generated__/NoteFormQuery'
import {
  CreateNoteMutation,
  CreateNoteMutationVariables,
} from './__generated__/CreateNoteMutation'

const MODELS_QUERY = gql`
  query NoteFormQuery($slug: String!) {
    deck(slug: $slug) {
      id
      title
    }
    cardModels {
      id
      name
      fields {
        id
        name
      }
    }
  }
`

const CREATE_NOTE_MUTATION = gql`
  mutation CreateNoteMutation(
    $deckId: ID!
    $modelId: ID!
    $values: [FieldValueInput!]!
  ) {
    createNote(deckId: $deckId, modelId: $modelId, fieldValues: $values) {
      id
    }
  }
`

const AddNotePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data, loading } = useQuery<NoteFormQuery, NoteFormQueryVariables>(
    MODELS_QUERY,
    {
      variables: { slug },
    }
  )

  const { cardModels: models, deck } = data || {}

  const [createNote] = useMutation<
    CreateNoteMutation,
    CreateNoteMutationVariables
  >(CREATE_NOTE_MUTATION)

  const { i18n } = useLingui()
  const [selectedModelId, setSelectedModelId] = useState('')

  const selectedModel = useMemo(() => {
    if (!models) {
      return null
    }

    return models.find(model => model.id === selectedModelId)
  }, [models, selectedModelId])

  useTopBarLoading(loading)

  const handleSubmit = useCallback(async () => {
    const { id } = await createNote({
      variables: {
        modelId: selectedModelId,
        deckId: deck.id,
      },
    })

    console.log('created note id', id)
  }, [createNote, deck, selectedModelId])

  if (loading) {
    return null
  }

  if (!models.length) {
    return (
      <Container>
        <Headline5>
          <Trans>You haven't created any models yet.</Trans>
        </Headline5>
      </Container>
    )
  }

  return (
    <Container>
      <BackButton />

      <Headline5>
        <Trans>Create Note for deck "{deck.title}"</Trans>
      </Headline5>

      <div className="flex flex-column mt3">
        <label className="flex flex-column">
          {i18n._(t`Select a model`)}
          {
            // eslint-disable-next-line jsx-a11y/no-onchange
            <select
              className="mt3"
              value={selectedModelId}
              onChange={e => setSelectedModelId(e.target.value)}
            >
              <option value="" disabled />
              {models.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          }
        </label>

        {selectedModelId !== '' && (
          <>
            <Subtitle1 className="mt2">
              <Trans>Fields</Trans>
            </Subtitle1>

            {selectedModel.fields.length > 0 ? (
              <>
                {selectedModel.fields.map(field => (
                  <React.Fragment key={field.id}>
                    <Caption className="mt3" key={field.id}>
                      {field.name}
                    </Caption>

                    <FieldValueEditor className="mt1" />
                  </React.Fragment>
                ))}

                <Button
                  raised
                  className="mt3 self-start"
                  onClick={handleSubmit}
                >
                  <Trans>Add Note</Trans>
                </Button>
              </>
            ) : (
              <Body2 className="mt2">
                <Trans>
                  The selected model doesn't have any fields. Please, select
                  another one
                </Trans>
              </Body2>
            )}
          </>
        )}
      </div>
    </Container>
  )
}

export default AddNotePage
