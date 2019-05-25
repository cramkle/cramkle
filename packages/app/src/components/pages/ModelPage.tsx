import { Trans } from '@lingui/macro'
import List, { ListItem, ListItemText } from '@material/react-list'
import Tab from '@material/react-tab'
import TabBar from '@material/react-tab-bar'
import { Headline4, Caption, Body1, Body2 } from '@material/react-typography'
import gql from 'graphql-tag'
import React, { useEffect, useState } from 'react'
import { compose, graphql, ChildProps } from 'react-apollo'
import { Helmet } from 'react-helmet'
import { RouteComponentProps } from 'react-router'

import { ModelQuery, ModelQueryVariables } from './__generated__/ModelQuery'
import DeleteModelButton from '../DeleteModelButton'
import TemplateEditor from '../TemplateEditor'
import BackButton from '../BackButton'
import Container from '../views/Container'
import loadingMutation from '../../graphql/topBarLoadingMutation.gql'
import { SetLoadingMutation } from '../../graphql/__generated__/SetLoadingMutation'

type Props = RouteComponentProps<{ id: string }>
type Query = ModelQuery & SetLoadingMutation

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

const ModelPage: React.FunctionComponent<ChildProps<Props, Query>> = ({
  data: { loading, cardModel },
  mutate,
}) => {
  useEffect(() => {
    mutate({ variables: { loading } })
  }, [loading, mutate])

  const [selectedTemplate, setSelectedTemplate] = useState(0)

  const handleTemplateSelect = (index: number) => {
    setSelectedTemplate(index)
  }

  if (loading) {
    return null
  }

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
              handleActiveIndexUpdate={handleTemplateSelect}
            >
              {cardModel.templates.map(template => (
                <Tab key={template.id}>{template.name}</Tab>
              ))}
            </TabBar>

            {cardModel.templates.map((template, index) => (
              <div hidden={selectedTemplate !== index} key={template.id}>
                <Caption className="dib mt3">
                  <Trans>Template front side</Trans>
                </Caption>
                <TemplateEditor
                  initialContentState={template.frontSide}
                  fields={cardModel.fields}
                />

                <Caption className="dib mt3">
                  <Trans>Template back side</Trans>
                </Caption>
                <TemplateEditor
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
            {cardModel.fields.map(field => (
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

export default compose(
  graphql<Props, ModelQuery, ModelQueryVariables>(MODEL_QUERY, {
    options: props => ({
      variables: {
        id: props.match.params.id,
      },
    }),
  }),
  graphql<Props, SetLoadingMutation>(loadingMutation)
)(ModelPage)
