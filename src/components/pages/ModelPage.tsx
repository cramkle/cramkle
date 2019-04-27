import List, { ListItem, ListItemText } from '@material/react-list'
import Tab from '@material/react-tab'
import TabBar from '@material/react-tab-bar'
import { Headline4, Caption, Body1, Body2 } from '@material/react-typography'
import React, { useEffect, useState } from 'react'
import { compose, graphql, ChildProps } from 'react-apollo'
import { Helmet } from 'react-helmet'
import { RouteComponentProps } from 'react-router'

import DeleteModelButton from '../DeleteModelButton'
import TemplateEditor from '../TemplateEditor'
import BackButton from '../BackButton'
import modelQuery from '../../graphql/modelQuery.gql'
import {
  ModelQuery,
  ModelQueryVariables,
} from '../../graphql/__generated__/ModelQuery'
import loadingMutation from '../../graphql/topBarLoadingMutation.gql'
import { TopBarLoadingQuery } from '../../graphql/__generated__/TopBarLoadingQuery'

type Props = RouteComponentProps<{ id: string }>
type Query = ModelQuery & TopBarLoadingQuery

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
      <div className="pa3 ph4-m ph6-l">
        <BackButton />
        <div className="flex justify-between">
          <Headline4>{cardModel.name}</Headline4>

          <DeleteModelButton model={cardModel} />
        </div>

        <Body1 className="dib mv3">Templates</Body1>
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
                <Caption className="dib mt3">Template front side</Caption>
                <TemplateEditor
                  initialContentState={template.frontSide}
                  fields={cardModel.fields}
                />

                <Caption className="dib mt3">Template back side</Caption>
                <TemplateEditor
                  initialContentState={template.backSide}
                  fields={cardModel.fields}
                />
              </div>
            ))}
          </>
        ) : (
          <Body2>
            You haven&apos;t created any templates on this model yet.
          </Body2>
        )}

        <Body1 className="mv3">Fields</Body1>
        {cardModel.fields.length ? (
          <List dense>
            {cardModel.fields.map(field => (
              <ListItem key={field.id}>
                <ListItemText primaryText={field.name} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Body2 className="mv3">This model doesn&apos;t have any fields</Body2>
        )}
      </div>
    </>
  )
}

export default compose(
  graphql<Props, ModelQuery, ModelQueryVariables>(modelQuery, {
    options: props => ({
      variables: {
        id: props.match.params.id,
      },
    }),
  }),
  graphql<Props, TopBarLoadingQuery>(loadingMutation)
)(ModelPage)
