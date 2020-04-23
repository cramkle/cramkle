import { useMutation, useQuery } from '@apollo/react-hooks'
import { Trans, plural } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import List, { ListItem, ListItemText } from '@material/react-list'
import { ContentState, convertToRaw } from 'draft-js'
import gql from 'graphql-tag'
import React, { useCallback, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router'

import useTopBarLoading from '../../hooks/useTopBarLoading'
import BackButton from '../BackButton'
import DeleteModelButton from '../DeleteModelButton'
import TemplateEditor from '../TemplateEditor'
import CircularProgress from '../views/CircularProgress'
import Container from '../views/Container'
import Tab from '../views/Tab'
import TabBar from '../views/TabBar'
import {
  Body1,
  Body2,
  Caption,
  Headline4,
  Headline5,
} from '../views/Typography'
import {
  ModelQuery,
  ModelQueryVariables,
  ModelQuery_cardModel_fields,
  ModelQuery_cardModel_templates,
} from './__generated__/ModelQuery'
import {
  UpdateTemplateBackContentMutation,
  UpdateTemplateBackContentMutationVariables,
} from './__generated__/UpdateTemplateBackContentMutation'
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
    cardModel(id: $id) {
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
        cards {
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
    updateTemplate(id: $id, frontSide: $content) {
      id
      frontSide {
        ...DraftContent
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
    updateTemplate(id: $id, backSide: $content) {
      id
      backSide {
        ...DraftContent
      }
    }
  }
`

const TEMPLATE_CONTENT_UPDATE_DEBOUNCE = 2000

interface TemplateDetailsProps {
  template: ModelQuery_cardModel_templates
  fields: ModelQuery_cardModel_fields[]
}

const TemplateDetails: React.FC<TemplateDetailsProps> = ({
  template,
  fields,
}) => {
  const [
    updateTemplateFrontContent,
    { loading: frontUpdateLoading },
  ] = useMutation<
    UpdateTemplateFrontContentMutation,
    UpdateTemplateFrontContentMutationVariables
  >(UPDATE_FRONT_TEMPLATE_MUTATION)
  const [
    updateTemplateBackContent,
    { loading: backUpdateLoading },
  ] = useMutation<
    UpdateTemplateBackContentMutation,
    UpdateTemplateBackContentMutationVariables
  >(UPDATE_BACK_TEMPLATE_MUTATION)

  const frontDebounceIdRef = useRef<NodeJS.Timeout | null>(null)
  const backDebounceIdRef = useRef<NodeJS.Timeout | null>(null)

  const handleFrontSideChange = useCallback(
    (contentState: ContentState) => {
      if (frontDebounceIdRef.current) {
        clearTimeout(frontDebounceIdRef.current)
      }

      frontDebounceIdRef.current = setTimeout(() => {
        updateTemplateFrontContent({
          variables: {
            id: template.id,
            content: convertToRaw(contentState),
          },
        })
      }, TEMPLATE_CONTENT_UPDATE_DEBOUNCE)
    },
    [template.id, updateTemplateFrontContent]
  )

  const handleBackSideChange = useCallback(
    (contentState: ContentState) => {
      if (backDebounceIdRef.current) {
        clearTimeout(backDebounceIdRef.current)
      }

      backDebounceIdRef.current = setTimeout(() => {
        updateTemplateBackContent({
          variables: {
            id: template.id,
            content: convertToRaw(contentState),
          },
        })
      }, TEMPLATE_CONTENT_UPDATE_DEBOUNCE)
    },
    [template.id, updateTemplateBackContent]
  )

  return (
    <>
      <Caption className="h2 flex items-center mt3">
        <Trans>Template front side</Trans>{' '}
        {frontUpdateLoading && <CircularProgress className="ml2" size={16} />}
      </Caption>
      <TemplateEditor
        id={template.id}
        initialContentState={template.frontSide}
        fields={fields}
        onChange={handleFrontSideChange}
      />

      <Caption className="h2 flex items-center mt3">
        <Trans>Template back side</Trans>{' '}
        {backUpdateLoading && <CircularProgress className="ml2" size={16} />}
      </Caption>
      <TemplateEditor
        id={template.id}
        initialContentState={template.backSide}
        fields={fields}
        onChange={handleBackSideChange}
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

  const [selectedTemplate, setSelectedTemplate] = useState(0)

  const handleTemplateSelect = useCallback((index: number) => {
    setSelectedTemplate(index)
  }, [])

  if (loading) {
    return null
  }

  const { cardModel } = data

  const totalFlashCards = cardModel.notes.reduce(
    (total, note) => total + note.cards.length,
    0
  )

  return (
    <>
      <Helmet title={cardModel.name} />
      <Container>
        <BackButton />
        <div className="flex flex-column mb4">
          <div className="flex justify-between">
            <Headline4>
              <Trans>Model details</Trans>
            </Headline4>

            <DeleteModelButton model={cardModel} />
          </div>

          <Headline5 className="mt3">{cardModel.name}</Headline5>
          <Caption className="mt1 c-text-secondary f6">
            {i18n._(
              plural(cardModel.notes.length, {
                one: '# note',
                other: '# notes',
              })
            )}{' '}
            <span className="dib mh1">&middot;</span>{' '}
            {i18n._(
              plural(totalFlashCards, {
                one: '# flashcard',
                other: '# flashcards',
              })
            )}
          </Caption>
        </div>

        <Body1 className="dib mb3">
          <Trans>Templates</Trans>
        </Body1>
        {cardModel.templates.length ? (
          <>
            <TabBar
              activeIndex={selectedTemplate}
              onActiveIndexUpdate={handleTemplateSelect}
            >
              {cardModel.templates.map((template) => (
                <Tab key={template.id}>{template.name}</Tab>
              ))}
            </TabBar>

            {cardModel.templates.map((template, index) => (
              <div hidden={selectedTemplate !== index} key={template.id}>
                <TemplateDetails
                  template={template}
                  fields={cardModel.fields}
                />
              </div>
            ))}
          </>
        ) : (
          <Body2>
            <Trans>You haven't created any templates on this model yet.</Trans>
          </Body2>
        )}

        <Body1 className="mv3">
          <Trans>Fields</Trans>
        </Body1>
        {cardModel.fields.length ? (
          <List dense>
            {cardModel.fields.map((field) => (
              <ListItem key={field.id}>
                <ListItemText primaryText={field.name} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Body2 className="mv3">
            <Trans>This model doesn't have any fields yet.</Trans>
          </Body2>
        )}
      </Container>
    </>
  )
}

export default ModelPage
