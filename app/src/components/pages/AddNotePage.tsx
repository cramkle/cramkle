import { useMutation, useQuery } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ContentState, convertToRaw } from 'draft-js'
import gql from 'graphql-tag'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router'

import { FieldInput, FieldValueInput } from '../../globalTypes'
import useTopBarLoading from '../../hooks/useTopBarLoading'
import { notificationState } from '../../notification/index'
import BackButton from '../BackButton'
import FieldValueEditor from '../FieldValueEditor'
import Button from '../views/Button'
import CircularProgress from '../views/CircularProgress'
import Container from '../views/Container'
import { Listbox, ListboxOption } from '../views/Listbox'
import { Body1, Body2, Headline1, Headline5 } from '../views/Typography'
import {
  CreateNoteMutation,
  CreateNoteMutationVariables,
} from './__generated__/CreateNoteMutation'
import {
  NoteFormQuery,
  NoteFormQueryVariables,
} from './__generated__/NoteFormQuery'

const MODELS_QUERY = gql`
  query NoteFormQuery($slug: String!) {
    deck(slug: $slug) {
      id
      title
    }
    models {
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

const DEFAULT_OPTION = 'default'

const AddNotePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const history = useHistory()
  const { data, loading } = useQuery<NoteFormQuery, NoteFormQueryVariables>(
    MODELS_QUERY,
    {
      variables: { slug },
    }
  )

  const { models, deck } = data || {}

  const [formKey, setFormKey] = useState(0)
  const [fieldValueMap, setFieldValueMap] = useState<{
    [fieldId: string]: FieldValueInput
  }>({})

  const [createNote, { loading: submitLoading }] = useMutation<
    CreateNoteMutation,
    CreateNoteMutationVariables
  >(CREATE_NOTE_MUTATION)

  const { i18n } = useLingui()
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_OPTION)

  useEffect(() => {
    if (loading || data.models.length === 0) {
      return
    }

    setSelectedModelId(data.models[0].id)
  }, [loading, data])

  const selectedModel = useMemo(() => {
    if (!models) {
      return null
    }

    return models.find((model) => model.id === selectedModelId)
  }, [models, selectedModelId])

  useTopBarLoading(loading)

  const handleSubmit = useCallback(async () => {
    const {
      data: {
        createNote: { id },
      },
    } = await createNote({
      variables: {
        modelId: selectedModelId,
        deckId: deck.id,
        values: Object.values(fieldValueMap),
      },
    })

    notificationState.addNotification({
      message: t`Note created successfully`,
      actionText: t`View`,
      onAction: () => {
        history.push(`/d/${slug}/note/${id}`)
      },
    })

    setFieldValueMap({})
    setFormKey((prevKey) => prevKey + 1)
  }, [createNote, deck, selectedModelId, fieldValueMap, history, slug])

  const handleFieldValueChange = useCallback(
    (content: ContentState, field: FieldInput) => {
      setFieldValueMap((prevValue) => ({
        ...prevValue,
        [field.id]: {
          field: {
            id: field.id,
            name: field.name,
          },
          data: convertToRaw(content),
        },
      }))
    },
    []
  )

  if (loading) {
    return null
  }

  if (!models.length) {
    return (
      <Container>
        <BackButton to={`/d/${slug}`} />

        <Headline5>
          <Trans>You haven't created any models yet.</Trans>
        </Headline5>
      </Container>
    )
  }

  return (
    <Container>
      <BackButton to={`/d/${slug}`} />

      <Headline1>
        <Trans>
          Create Note for deck{' '}
          <span className="font-semibold">{deck.title}</span>
        </Trans>
      </Headline1>

      <div className="flex flex-col mt-3">
        <label className="flex flex-col">
          <Listbox
            value={selectedModelId}
            onChange={(value) => setSelectedModelId(value)}
          >
            <ListboxOption value={DEFAULT_OPTION} disabled>
              {i18n._(t`Select a model`)}
            </ListboxOption>
            {models.map((model) => (
              <ListboxOption key={model.id} value={model.id}>
                {model.name}
              </ListboxOption>
            ))}
          </Listbox>
        </label>

        {selectedModel != null && (
          <React.Fragment key={formKey}>
            <Body1 className="mt-2">
              <Trans>Fields</Trans>
            </Body1>

            {selectedModel.fields.length > 0 ? (
              <>
                {selectedModel.fields.map((field) => (
                  <React.Fragment key={field.id}>
                    <Body1 className="mt-4" key={field.id}>
                      {field.name}
                    </Body1>

                    <FieldValueEditor
                      className="mt-1"
                      onChange={handleFieldValueChange}
                      field={field}
                    />
                  </React.Fragment>
                ))}

                <Button
                  raised
                  className="mt-4 self-start"
                  onClick={handleSubmit}
                  disabled={submitLoading}
                >
                  {!submitLoading ? (
                    <Trans>Add Note</Trans>
                  ) : (
                    <CircularProgress />
                  )}
                </Button>
              </>
            ) : (
              <Body2 className="mt-2">
                <Trans>
                  The selected model doesn't have any fields. Please, select
                  another one
                </Trans>
              </Body2>
            )}
          </React.Fragment>
        )}
      </div>
    </Container>
  )
}

export default AddNotePage
