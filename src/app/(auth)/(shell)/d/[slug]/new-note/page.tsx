'use client'

import { gql, useMutation, useQuery } from '@apollo/client'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import type { ContentState } from 'draft-js'
import { convertToRaw } from 'draft-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import * as React from 'react'

import BackButton from '@src/components/BackButton'
import FieldValueEditor from '@src/components/FieldValueEditor'
import { Button } from '@src/components/views/Button'
import { Card, CardContent } from '@src/components/views/Card'
import { CircularProgress } from '@src/components/views/CircularProgress'
import { Container } from '@src/components/views/Container'
import { Listbox, ListboxOption } from '@src/components/views/Listbox'
import {
  Body1,
  Body2,
  Headline1,
  Headline2,
} from '@src/components/views/Typography'
import type { FieldInput, FieldValueInput } from '@src/globalTypes'
import { useTopBarLoading } from '@src/hooks/useTopBarLoading'
import { TIMEOUT_MEDIUM, pushToast } from '@src/toasts/pushToast'

import type {
  CreateNoteMutation,
  CreateNoteMutationVariables,
} from './__generated__/CreateNoteMutation'
import type {
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
    createNote(
      input: { deckId: $deckId, modelId: $modelId, fieldValues: $values }
    ) {
      note {
        id
      }
    }
  }
`

const DEFAULT_OPTION = 'default'

export default function NewNotePage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const router = useRouter()
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
    if (loading || !data || data.models.length == 0) {
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

  useEffect(() => {
    setFieldValueMap({})
  }, [selectedModel])

  useTopBarLoading(loading)

  const handleSubmit = useCallback(async () => {
    const { data } = await createNote({
      variables: {
        modelId: selectedModelId,
        deckId: deck!.id,
        values: Object.values(fieldValueMap),
      },
    })

    const id = data?.createNote?.note?.id

    if (!id) {
      return
    }

    pushToast(
      {
        message: t`Note created successfully`,
        action: {
          label: t`View`,
          onPress: () => {
            router.push(`/d/${slug}/note/${id}`)
          },
        },
      },
      TIMEOUT_MEDIUM
    )

    setFieldValueMap({})
    setFormKey((prevKey) => prevKey + 1)
  }, [createNote, deck, selectedModelId, fieldValueMap, router, slug])

  const handleFieldValueChange = useCallback(
    (content: ContentState, field: FieldInput) => {
      setFieldValueMap((prevValue) => ({
        ...prevValue,
        [field.id!]: {
          field: {
            id: field.id!,
            name: field.name!,
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

  console.log(models)

  return (
    <Container className="py-4">
      <BackButton to={`/d/${slug}`} />

      <Headline1 className="border-b border-divider border-opacity-divider text-txt text-opacity-text-primary">
        <Trans>
          Create note for deck{' '}
          <span className="font-semibold">{deck!.title}</span>
        </Trans>
      </Headline1>

      {models?.length ?? 0 > 0 ? (
        <div className="flex flex-col mt-6">
          <Card>
            <CardContent>
              <label className="flex items-center text-txt text-opacity-text-primary">
                <Trans>Note's model</Trans>
                <Listbox
                  className="ml-3"
                  value={selectedModelId}
                  onChange={(value) => setSelectedModelId(value)}
                >
                  <ListboxOption value={DEFAULT_OPTION} disabled>
                    {i18n._(t`Select a model`)}
                  </ListboxOption>
                  <ListboxOption value={DEFAULT_OPTION}>teste</ListboxOption>
                  <ListboxOption value={DEFAULT_OPTION}>teste</ListboxOption>
                  <ListboxOption value={DEFAULT_OPTION}>teste</ListboxOption>
                  <ListboxOption value={DEFAULT_OPTION}>teste</ListboxOption>
                  <ListboxOption value={DEFAULT_OPTION}>teste</ListboxOption>
                  <ListboxOption value={DEFAULT_OPTION}>teste</ListboxOption>
                  <ListboxOption value={DEFAULT_OPTION}>teste</ListboxOption>
                  {models?.map((model) => (
                    <ListboxOption key={model.id} value={model.id}>
                      {model.name}
                    </ListboxOption>
                  ))}
                </Listbox>
              </label>

              {selectedModel != null && (
                <React.Fragment key={formKey}>
                  <Headline2 className="mt-3 text-txt text-opacity-text-primary">
                    <Trans>Fields</Trans>
                  </Headline2>

                  {selectedModel.fields.length > 0 ? (
                    <>
                      {selectedModel.fields.map((field) => (
                        <React.Fragment key={field.id}>
                          <Body1
                            className="mt-4 text-txt text-opacity-text-primary"
                            key={field.id}
                          >
                            {field.name}
                          </Body1>

                          <FieldValueEditor
                            className="mt-2"
                            onChange={handleFieldValueChange}
                            field={field}
                          />
                        </React.Fragment>
                      ))}

                      <Button
                        className="mt-4 self-start"
                        variation="primary"
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
                    <Body1 className="mt-6 text-txt text-opacity-text-primary">
                      <Trans>
                        The selected model doesn't have any fields.{' '}
                        <Link
                          className="text-primary hover:underline"
                          href={`/m/${selectedModel.id}`}
                        >
                          Click here to edit it
                        </Link>
                      </Trans>
                    </Body1>
                  )}
                </React.Fragment>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center mt-6">
          <Body1 className="text-txt text-opacity-text-primary">
            <Trans>You haven't created a model yet.</Trans>
          </Body1>

          <Body2 className="mt-2">
            <Trans>
              To create a note you need to associate it with a model.
            </Trans>
          </Body2>

          <Button
            className="mt-6"
            onClick={() => router.push('/models/new-model')}
          >
            <Trans>Create a model</Trans>
          </Button>
        </div>
      )}
    </Container>
  )
}
