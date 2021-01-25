import { useMutation, useQuery } from '@apollo/react-hooks'
import { Trans, plural, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ContentState, convertToRaw } from 'draft-js'
import type { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { ReactNode, useCallback, useState } from 'react'
import * as React from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

import useTopBarLoading from '../../hooks/useTopBarLoading'
import BackButton from '../BackButton'
import DeleteModelButton from '../DeleteModelButton'
import EditFieldsDialog from '../EditFieldsDialog'
import EditTemplatesDialog from '../EditTemplatesDialog'
import TemplateEditor from '../TemplateEditor'
import PersistedEditor from '../editor/PersistedEditor'
import OverflowMenuIcon from '../icons/OverflowMenuIcon'
import Button from '../views/Button'
import Container from '../views/Container'
import { Menu, MenuButton, MenuItem, MenuList } from '../views/MenuButton'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '../views/Tabs'
import { Body1, Body2, Headline1, Headline2 } from '../views/Typography'
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
  const [updateTemplateContent, { loading, error }] = useMutation<
    UpdateTemplateFrontContentMutation,
    UpdateTemplateFrontContentMutationVariables
  >(mutation)

  const handleSave = useCallback(
    (contentState: ContentState) => {
      updateTemplateContent({
        variables: {
          id: templateId,
          content: convertToRaw(contentState),
        },
      })
    },
    [templateId, updateTemplateContent]
  )

  return (
    <div className="mt-4">
      <PersistedEditor
        title={
          <Body2 className="leading-4 tracking-wide font-medium">{label}</Body2>
        }
        loading={loading}
        error={error}
        saveDebounceMs={TEMPLATE_CONTENT_UPDATE_DEBOUNCE}
        onSave={handleSave}
        errorMessage={t`An error occurred when saving the template`}
        blockMessage={t`Your model is not saved, are you sure you want to exit the page?`}
      >
        {({ onChange }) => (
          <TemplateEditor
            id={templateId}
            initialContentState={draftContent}
            fields={fields}
            onChange={onChange}
          />
        )}
      </PersistedEditor>
    </div>
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
        draftContent={template.frontSide!}
        templateId={template.id}
        fields={fields}
        mutation={UPDATE_FRONT_TEMPLATE_MUTATION}
      />
      <TemplateDetails
        label={<Trans>Template back side</Trans>}
        draftContent={template.backSide!}
        templateId={template.id}
        fields={fields}
        mutation={UPDATE_BACK_TEMPLATE_MUTATION}
      />
    </>
  )
}

const ModelPage: React.FC = () => {
  const { id } = useParams() as { id: string }
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

  if (data?.model == null) {
    return (
      <div className="flex flex-col items-center justify-center p-4 sm:px-0">
        <Headline2 className="text-center sm:text-left">
          <Trans>Model not found</Trans>
        </Headline2>
        <Link className="mt-8 sm:mt-4 text-primary" to="/home">
          <Trans>Go to home</Trans>
        </Link>
      </div>
    )
  }

  const { model } = data

  return (
    <>
      <Helmet title={model.name!} />
      <Container>
        <BackButton to="/models" />
        <div className="flex flex-col mb-8">
          <div className="flex justify-between items-baseline">
            <Headline1 className="text-txt text-opacity-text-primary">
              <Trans>Model details</Trans>
            </Headline1>

            <DeleteModelButton model={model} />
          </div>

          <Headline2 className="text-txt text-opacity-text-primary mt-4">
            {model.name}
          </Headline2>
          <Body2 className="mt-1">
            {i18n._(
              plural(model.totalNotes, {
                one: '# note',
                other: '# notes',
              })
            )}{' '}
            <span className="inline-block mx-1">&middot;</span>{' '}
            {i18n._(
              plural(model.totalFlashcards, {
                one: '# flashcard',
                other: '# flashcards',
              })
            )}
          </Body2>
        </div>

        <div className="bg-surface border-2 rounded-xl overflow-hidden border-divider border-opacity-divider px-4 pb-4">
          <div className="flex items-center justify-between py-4">
            <Body1 className="inline-block text-txt text-opacity-text-primary">
              <Trans>Templates</Trans>
            </Body1>

            <EditTemplatesDialog
              isOpen={editingTemplates}
              onDismiss={() => setEditingTemplates(false)}
              templates={model.templates}
              modelId={model.id}
            />
            <EditFieldsDialog
              isOpen={editingFields}
              onDismiss={() => setEditingFields(false)}
              fields={model.fields}
              modelId={model.id}
            />

            <div className="sm:hidden">
              <Menu>
                <MenuButton icon className="text-txt text-opacity-text-primary">
                  <OverflowMenuIcon />
                </MenuButton>
                <MenuList>
                  <MenuItem onSelect={() => setEditingTemplates(true)}>
                    <Trans>Edit templates</Trans>
                  </MenuItem>
                  <MenuItem onSelect={() => setEditingFields(true)}>
                    <Trans>Edit fields</Trans>
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>

            <div className="flex items-center hidden sm:block">
              <Button
                className="ml-2"
                onClick={() => setEditingTemplates(true)}
              >
                <Trans>Edit templates</Trans>
              </Button>

              <Button
                variation="secondary"
                className="ml-2"
                onClick={() => setEditingFields(true)}
              >
                <Trans>Edit fields</Trans>
              </Button>
            </div>
          </div>
          {model.templates.length ? (
            <Tabs>
              <TabList className="border-t border-b border-divider border-opacity-divider -mx-4">
                {model.templates.map((template) => (
                  <Tab
                    key={template.id}
                    className="text-txt text-opacity-text-primary"
                  >
                    {template.name}
                  </Tab>
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
            <div className="border-t border-divider border-opacity-divider -mx-4">
              <Body2 className="text-txt text-opacity-text-primary text-center mt-6 mb-4">
                <Trans>
                  You haven't created any templates on this model yet.
                </Trans>
              </Body2>
            </div>
          )}
        </div>
      </Container>
    </>
  )
}

export default ModelPage
