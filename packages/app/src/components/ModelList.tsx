import { ChildProps, graphql } from '@apollo/react-hoc'
import { Trans } from '@lingui/macro'
import { Grid } from '@material/react-layout-grid'
import { Body1 } from '@material/react-typography'
import gql from 'graphql-tag'
import { compose } from 'ramda'
import React, { useEffect } from 'react'

import ModelCard from './ModelCard'
import { ModelsQuery } from './__generated__/ModelsQuery'
import loadingMutation from '../graphql/topBarLoadingMutation.gql'
import {
  SetLoadingMutation,
  SetLoadingMutationVariables,
} from '../graphql/__generated__/SetLoadingMutation'

type Query = ModelsQuery & SetLoadingMutation

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
  mutate,
}) => {
  useEffect(() => {
    mutate({ variables: { loading } })
  }, [loading, mutate])

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

export default compose(
  graphql<{}, ModelsQuery>(MODELS_QUERY),
  graphql<{}, SetLoadingMutation, SetLoadingMutationVariables>(loadingMutation)
)(ModelList)
