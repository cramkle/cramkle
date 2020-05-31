import { useMutation, useQuery } from '@apollo/react-hooks'
import { Trans, plural } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import classnames from 'classnames'
import { ContentState, convertToRaw } from 'draft-js'
import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router'

import useTopBarLoading from '../../hooks/useTopBarLoading'
import BackButton from '../BackButton'
import DeleteModelButton from '../DeleteModelButton'
import EditFieldsDialog from '../EditFieldsDialog'
import EditTemplatesDialog from '../EditTemplatesDialog'
import TemplateEditor from '../TemplateEditor'
import DoneIcon from '../icons/DoneIcon'
import Button from '../views/Button'
import CircularProgress from '../views/CircularProgress'
import Container from '../views/Container'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '../views/Tabs'
import { Body1, Body2, Headline1, Headline2 } from '../views/Typography'
import styles from './ModelPage.css'
import { DRAFT_CONTENT_FRAGMENT, MODEL_QUERY } from './ModelQuery'
import { DraftContent } from './__generated__/DraftContent'
import {
  ModelQuery,
  ModelQueryVariables,
  ModelQuery_model_fields,
  ModelQuery_model_templates,
} from './__generated__/ModelQuery'
import {
  UpdateTemplateFrontContentMutation,
  UpdateTemplateFrontContentMutationVariables,
} from './__generated__/UpdateTemplateFrontContentMutation'

const UPDATE_FRONT_TEMPLATE_MUTATION = gql`
  ${DRAFT_CONTENT_FRAGMENT}

  mutation UpdateTemplateFrontContentMutation(
    $id: ID!
    $content: ContentStateInput
  ) {
    updateTemplate(input: { id: $id, frontSide: $content }) {
      template {
        id
        frontSide {
          ...DraftContent
        }
      }
    }
  }
`

const UPDATE_BACK_TEMPLATE_MUTATION = gql`
  ${DRAFT_CONTENT_FRAGMENT}

  mutation UpdateTemplateBackContentMutation(
    $id: ID!
    $content: ContentStateInput
  ) {
    updateTemplate(input: { id: $id, backSide: $content }) {
      template {
        id
        backSide {
          ...DraftContent
        }
      }
    }
  }
`

const TEMPLATE_CONTENT_UPDATE_DEBOUNCE = 2000

interface TemplateDetailsProps {
  label: ReactNode
  templateId: string
  mutation: DocumentNode
  draftContent: DraftContent
  fields: ModelQuery_model_fields[]
}

const TemplateDetails: React.FC<TemplateDetailsProps> = ({
  label,
  templateId,
  mutation,
  draftContent,
  fields,
}) => {
  const [updateTemplateContent, { loading }] = useMutation<
    UpdateTemplateFrontContentMutation,
    UpdateTemplateFrontContentMutationVariables
  >(mutation)

  const debounceIdRef = useRef<NodeJS.Timeout | null>(null)

  const handleChange = useCallback(
    (contentState: ContentState) => {
      if (debounceIdRef.current) {
        clearTimeout(debounceIdRef.current)
      }

      debounceIdRef.current = setTimeout(() => {
        updateTemplateContent({
          variables: {
            id: templateId,
            content: convertToRaw(contentState),
          },
        })
      }, TEMPLATE_CONTENT_UPDATE_DEBOUNCE)
    },
    [templateId, updateTemplateContent]
  )

  const [saved, setSaved] = useState(false)
  const prevLoadingRef = useRef(loading)

  useEffect(() => {
    if (prevLoadingRef.current === loading || loading) {
      return
    }

    setSaved(true)
  }, [loading])

  useEffect(() => {
    prevLoadingRef.current = loading
  }, [loading])

  useEffect(() => {
    if (!saved) {
      return
    }

    const id = setTimeout(() => {
      setSaved(false)
    }, 2000)

    return () => clearTimeout(id)
  })

  const prevSavedRef = useRef(saved)

  useEffect(() => {
    prevSavedRef.current = saved
  }, [saved])

  return (
    <>
      <div className="flex items-end mt-4">
        <Body2 className="leading-4 tracking-wide font-medium">{label}</Body2>{' '}
        {loading && <CircularProgress className="ml-2" size={16} />}
        <Body2
          className={classnames(
            'inline-flex items-center ml-2 invisible opacity-0',
            {
              [styles.fadeIn]: saved,
              [styles.fadeOut]: prevSavedRef.current && !saved,
            }
          )}
        >
          <DoneIcon className="text-green-1 mr-2 text-base" />
          <Trans>Changes saved successfully</Trans>
        </Body2>
      </div>
      <TemplateEditor
        id={templateId}
        initialContentState={draftContent}
        fields={fields}
        onChange={handleChange}
      />
    </>
  )
}

interface ModelTemplateDetailsProps {
  template: ModelQuery_model_templates
  fields: ModelQuery_model_fields[]
}

const ModelTemplateDetails: React.FC<ModelTemplateDetailsProps> = ({
  template,
  fields,
}) => {
  return (
    <>
      <TemplateDetails
        label={<Trans>Template front side</Trans>}
        draftContent={template.frontSide}
        templateId={template.id}
        fields={fields}
        mutation={UPDATE_FRONT_TEMPLATE_MUTATION}
      />
      <TemplateDetails
        label={<Trans>Template back side</Trans>}
        draftContent={template.backSide}
        templateId={template.id}
        fields={fields}
        mutation={UPDATE_BACK_TEMPLATE_MUTATION}
      />
    </>
  )
}

const ModelPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { i18n } = useLingui()
  const { data, loading } = useQuery<ModelQuery, ModelQueryVariables>(
    MODEL_QUERY,
    {
      variables: { id },
    }
  )

  const [editingTemplates, setEditingTemplates] = useState(false)
  const [editingFields, setEditingFields] = useState(false)

  useTopBarLoading(loading)

  if (loading) {
    return null
  }

  const { model } = data

  const totalFlashCards = model.notes.reduce(
    (total, note) => total + note.flashCards.length,
    0
  )

  return (
    <>
      <Helmet title={model.name} />
      <Container>
        <BackButton />
        <div className="flex flex-col mb-8">
          <div className="flex justify-between">
            <Headline1>
              <Trans>Model details</Trans>
            </Headline1>

            <DeleteModelButton model={model} />
          </div>

          <Headline2 className="mt-4">{model.name}</Headline2>
          <Body2 className="mt-1">
            {i18n._(
              plural(model.notes.length, {
                one: '# note',
                other: '# notes',
              })
            )}{' '}
            <span className="inline-block mx-1">&middot;</span>{' '}
            {i18n._(
              plural(totalFlashCards, {
                one: '# flashcard',
                other: '# flashcards',
              })
            )}
          </Body2>
        </div>

        <div className="bg-surface border rounded overflow-hidden border-gray-1 pt-2 px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <Body1 className="inline-block">
              <Trans>Templates</Trans>
            </Body1>

            <div className="flex items-center">
              <Button
                className="ml-2"
                onClick={() => setEditingTemplates(true)}
              >
                <Trans>Edit templates</Trans>
              </Button>
              <EditTemplatesDialog
                isOpen={editingTemplates}
                onDismiss={() => setEditingTemplates(false)}
                templates={model.templates}
                modelId={model.id}
              />

              <Button
                variation="secondary"
                className="ml-2"
                onClick={() => setEditingFields(true)}
              >
                <Trans>Edit fields</Trans>
              </Button>
              <EditFieldsDialog
                isOpen={editingFields}
                onDismiss={() => setEditingFields(false)}
                fields={model.fields}
                modelId={model.id}
              />
            </div>
          </div>
          {model.templates.length ? (
            <Tabs>
              <TabList className="border-t border-b border-gray-1 -mx-4">
                {model.templates.map((template) => (
                  <Tab key={template.id}>{template.name}</Tab>
                ))}
              </TabList>

              <TabPanels>
                {model.templates.map((template) => (
                  <TabPanel key={template.id}>
                    <ModelTemplateDetails
                      template={template}
                      fields={model.fields}
                    />
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          ) : (
            <Body2 className="text-center">
              <Trans>
                You haven't created any templates on this model yet.
              </Trans>
            </Body2>
          )}
        </div>
      </Container>
    </>
  )
}

export default ModelPage
