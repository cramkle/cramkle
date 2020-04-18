import { useMutation, useQuery } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Listbox, ListboxOption } from '@reach/listbox'
import gql from 'graphql-tag'
import React, { useCallback, useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router'

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
import { FieldInput, FieldValueInput } from '__generated__/globalTypes'
import { ContentState, convertToRaw } from 'draft-js'
import CircularProgress from 'components/views/CircularProgress'
import { notificationState } from 'notification/index'

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

  const { cardModels: models, deck } = data || {}

  const [fieldValueMap, setFieldValueMap] = useState<{
    [fieldId: string]: FieldValueInput
  }>({})

  const [createNote, { loading: submitLoading }] = useMutation<
    CreateNoteMutation,
    CreateNoteMutationVariables
  >(CREATE_NOTE_MUTATION)

  const { i18n } = useLingui()
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_OPTION)

  const selectedModel = useMemo(() => {
    if (!models) {
      return null
    }

    return models.find((model) => model.id === selectedModelId)
  }, [models, selectedModelId])

  useTopBarLoading(loading)

  const handleSubmit = useCallback(async () => {
    await createNote({
      variables: {
        modelId: selectedModelId,
        deckId: deck.id,
        values: Object.values(fieldValueMap),
      },
    })

    notificationState.addNotification({
      message: t`Note created successfully`,
    })

    history.push(`/d/${slug}`)
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
        <Headline5>
          <Trans>You haven't created any models yet.</Trans>
        </Headline5>
      </Container>
    )
  }

  return (
    <Container>
      <BackButton to={`/d/${slug}`} />

      <Headline5>
        <Trans>Create Note for deck "{deck.title}"</Trans>
      </Headline5>

      <div className="flex flex-column mt3">
        <label className="flex flex-column">
          <Listbox
            className="mt3"
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
          <>
            <Subtitle1 className="mt2">
              <Trans>Fields</Trans>
            </Subtitle1>

            {selectedModel.fields.length > 0 ? (
              <>
                {selectedModel.fields.map((field) => (
                  <React.Fragment key={field.id}>
                    <Caption className="mt3" key={field.id}>
                      {field.name}
                    </Caption>

                    <FieldValueEditor
                      className="mt1"
                      onChange={handleFieldValueChange}
                      field={field}
                    />
                  </React.Fragment>
                ))}

                <Button
                  raised
                  className="mt3 self-start"
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
