import { useQuery } from '@apollo/react-hooks'
import { Trans } from '@lingui/macro'
import List, { ListItem, ListItemText } from '@material/react-list'
import BackButton from 'components/BackButton'
import DeleteModelButton from 'components/DeleteModelButton'
import TemplateEditor from 'components/TemplateEditor'
import gql from 'graphql-tag'
import useTopBarLoading from 'hooks/useTopBarLoading'
import React, { useCallback, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router'
import Container from 'views/Container'
import Tab from 'views/Tab'
import TabBar from 'views/TabBar'
import { Body1, Body2, Caption, Headline4 } from 'views/Typography'

import { ModelQuery, ModelQueryVariables } from './__generated__/ModelQuery'

const MODEL_QUERY = gql`
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

const ModelPage: React.FunctionComponent = () => {
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
                <Caption className="dib mt3">
                  <Trans>Template front side</Trans>
                </Caption>
                <TemplateEditor
                  id={template.id}
                  isFrontSide
                  initialContentState={template.frontSide}
                  fields={cardModel.fields}
                />

                <Caption className="dib mt3">
                  <Trans>Template back side</Trans>
                </Caption>
                <TemplateEditor
                  id={template.id}
                  initialContentState={template.backSide}
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
