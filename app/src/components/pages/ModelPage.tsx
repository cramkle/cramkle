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
import TemplateEditor from '../TemplateEditor'
import CircularProgress from '../views/CircularProgress'
import Container from '../views/Container'
import Icon from '../views/Icon'
import { List, ListItem } from '../views/List'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '../views/Tabs'
import { Body1, Body2, Headline1, Headline2 } from '../views/Typography'
import styles from './ModelPage.css'
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

const DRAFT_CONTENT_FRAGMENT = gql`
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

const MODEL_QUERY = gql`
  ${DRAFT_CONTENT_FRAGMENT}

  query ModelQuery($id: ID!) {
    model(id: $id) {
      id
      name
      fields {
        id
        name
      }
      templates {
        id
        name
        frontSide {
          ...DraftContent
        }
        backSide {
          ...DraftContent
        }
      }
      notes {
        id
        flashCards {
          id
        }
      }
    }
  }
`

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
      <Body1 className="h-8 flex items-end mt-4">
        {label} {loading && <CircularProgress className="ml-2" size={16} />}
        <Body2
          className={classnames(
            'inline-flex items-center ml-2 invisible opacity-0',
            {
              [styles.fadeIn]: saved,
              [styles.fadeOut]: prevSavedRef.current && !saved,
            }
          )}
        >
          <Icon className="text-green-1 mr-2 text-base" icon="check" />
          <Trans>Changes saved successfully</Trans>
        </Body2>
      </Body1>
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

        <Body1 className="inline-block mb-4">
          <Trans>Templates</Trans>
        </Body1>
        {model.templates.length ? (
          <Tabs>
            <TabList>
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
          <Body2>
            <Trans>You haven't created any templates on this model yet.</Trans>
          </Body2>
        )}

        <Body1 className="my-4">
          <Trans>Fields</Trans>
        </Body1>
        {model.fields.length ? (
          <List>
            {model.fields.map((field) => (
              <ListItem key={field.id}>{field.name}</ListItem>
            ))}
          </List>
        ) : (
          <Body2 className="my-4">
            <Trans>This model doesn't have any fields yet.</Trans>
          </Body2>
        )}
      </Container>
    </>
  )
}

export default ModelPage
