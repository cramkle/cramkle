import { ChildProps, graphql } from '@apollo/react-hoc'
import { Trans } from '@lingui/macro'
import { Grid } from '@material/react-layout-grid'
import { Body1 } from '@material/react-typography'
import gql from 'graphql-tag'
import React from 'react'

import ModelCard from './ModelCard'
import { ModelsQuery } from './__generated__/ModelsQuery'
import useTopBarLoading from '../hooks/useTopBarLoading'

type Query = ModelsQuery

export const MODELS_QUERY = gql`
  query ModelsQuery {
    cardModels {
      id
      name
      templates {
        id
        name
      }
      fields {
        id
        name
      }
    }
  }
`

const ModelList: React.FunctionComponent<ChildProps<{}, Query>> = ({
  data: { loading, cardModels: models = [] },
}) => {
  useTopBarLoading(loading)

  if (loading) {
    return null
  }

  if (models.length === 0) {
    return (
      <div className="flex flex-column items-center">
        <Body1 className="mt4">
          <Trans>The models you create will appear here.</Trans>
        </Body1>
      </div>
    )
  }

  return (
    <Grid className="w-100">
      <div className="flex flex-column na2">
        {models.map(model => (
          <div key={model.id} className="pa2">
            <ModelCard {...model} />
          </div>
        ))}
      </div>
    </Grid>
  )
}

export default graphql<{}, ModelsQuery>(MODELS_QUERY)(ModelList)
