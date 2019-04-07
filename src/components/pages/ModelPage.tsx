import List, { ListItem, ListItemText } from '@material/react-list'
import Tab from '@material/react-tab'
import TabBar from '@material/react-tab-bar'
import { Headline4, Caption, Body1, Body2 } from '@material/react-typography'
import { ContentBlock } from 'draft-js'
import React, { useEffect, useState } from 'react'
import { compose, graphql, ChildProps } from 'react-apollo'
import { RouteComponentProps } from 'react-router'

import TemplateEditor from '../TemplateEditor'
import BackButton from '../BackButton'
import modelQuery from '../../graphql/modelQuery.gql'
import loadingMutation from '../../graphql/topBarLoadingMutation.gql'

interface TopbarQueryData {
  topBar: {
    loading: boolean
  }
}

type Props = RouteComponentProps<{ id: string }>

interface Data {
  cardModel: {
    id: string
    name: string
    fields: { id: string; name: string }[]
    templates: {
      id: string
      name: string
      frontSide: ContentBlock[]
      backSide: ContentBlock[]
    }[]
  }
}

const ModelPage: React.FunctionComponent<ChildProps<Props, Data>> = ({
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
    <div className="pa3 ph4-m ph6-l">
      <BackButton />
      <Headline4>{cardModel.name}</Headline4>

      <Body1 className="dib mt3">Fields</Body1>
      <List>
        {cardModel.fields.map(field => (
          <ListItem key={field.id}>
            <ListItemText primaryText={field.name} />
          </ListItem>
        ))}
      </List>

      {cardModel.templates.length ? (
        <>
          <Body1 className="mb3">Templates</Body1>
          <TabBar
            activeIndex={selectedTemplate}
            handleActiveIndexUpdate={handleTemplateSelect}
          >
            {cardModel.templates.map(template => (
              <Tab key={template.id}>{template.name}</Tab>
            ))}
          </TabBar>

          <Caption className="dib mt3">Template front side</Caption>
          <TemplateEditor
            template={cardModel.templates[selectedTemplate].frontSide}
          />

          <Caption className="dib mt3">Template back side</Caption>
          <TemplateEditor
            template={cardModel.templates[selectedTemplate].backSide}
          />
        </>
      ) : (
        <Body2>You haven&apos;t created any templates on this model yet.</Body2>
      )}
    </div>
  )
}

export default compose(
  graphql<Props, Data, { id: string }>(modelQuery, {
    options: props => ({
      variables: {
        id: props.match.params.id,
      },
    }),
  }),
  graphql<Props, TopbarQueryData>(loadingMutation)
)(ModelPage)
