import { useMutation, useQuery } from '@apollo/react-hooks'
import { Trans } from '@lingui/macro'
import List, { ListItem, ListItemText } from '@material/react-list'
import BackButton from 'components/BackButton'
import DeleteModelButton from 'components/DeleteModelButton'
import TemplateEditor from 'components/TemplateEditor'
import CircularProgress from 'components/views/CircularProgress'
import { ContentState, convertToRaw } from 'draft-js'
import gql from 'graphql-tag'
import useTopBarLoading from 'hooks/useTopBarLoading'
import React, { useCallback, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router'
import Container from 'views/Container'
import Tab from 'views/Tab'
import TabBar from 'views/TabBar'
import { Body1, Body2, Caption, Headline4 } from 'views/Typography'

import { ModelQuery, ModelQueryVariables } from './__generated__/ModelQuery'

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
      }
    }
  }
`

const UPDATE_FRONT_TEMPLATE_MUTATION = gql`
  ${DRAFT_CONTENT_FRAGMENT}

  mutation UpdateTemplateContentMutation(
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

  mutation UpdateTemplateContentMutation(
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

const TemplateDetails: React.FC<any> = ({ template, fields }) => {
  const [
    updateTemplateFrontContent,
    { loading: frontUpdateLoading },
  ] = useMutation(UPDATE_FRONT_TEMPLATE_MUTATION)
  const [
    updateTemplateBackContent,
    { loading: backUpdateLoading },
  ] = useMutation(UPDATE_BACK_TEMPLATE_MUTATION)

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

  return (
    <>
      <Helmet title={cardModel.name} />
      <Container>
        <BackButton />
        <div className="flex justify-between">
          <Headline4>{cardModel.name}</Headline4>

          <DeleteModelButton model={cardModel} />
        </div>

        <Body1 className="dib mv3">
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
