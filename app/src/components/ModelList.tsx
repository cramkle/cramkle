import { useQuery } from '@apollo/react-hooks'
import { Trans } from '@lingui/macro'
import { Grid } from '@material/react-layout-grid'
import gql from 'graphql-tag'
import React from 'react'

import useTopBarLoading from '../hooks/useTopBarLoading'
import ModelCard from './ModelCard'
import { ModelsQuery } from './__generated__/ModelsQuery'
import { Body1 } from './views/Typography'

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

const ModelList: React.FunctionComponent = () => {
  const { data: { cardModels: models = [] } = {}, loading } = useQuery<
    ModelsQuery
  >(MODELS_QUERY)

  useTopBarLoading(loading)

  if (loading) {
    return null
  }

  if (models.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <Body1 className="mt-8">
          <Trans>The models you create will appear here.</Trans>
        </Body1>
      </div>
    )
  }

  return (
    <Grid className="w-full">
      <div className="flex flex-col na2">
        {models.map((model) => (
          <div key={model.id} className="p-2">
            <ModelCard {...model} />
          </div>
        ))}
      </div>
    </Grid>
  )
}

export default ModelList
