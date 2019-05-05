import { Trans } from '@lingui/macro'
import { Grid } from '@material/react-layout-grid'
import { Body1 } from '@material/react-typography'
import React, { useEffect } from 'react'
import { compose, graphql, ChildProps } from 'react-apollo'

import ModelCard from './ModelCard'
import modelsQuery from '../graphql/modelsQuery.gql'
import { ModelsQuery } from '../graphql/__generated__/ModelsQuery'
import loadingMutation from '../graphql/topBarLoadingMutation.gql'
import { TopBarLoadingQuery } from '../graphql/__generated__/TopBarLoadingQuery'

type Query = ModelsQuery & TopBarLoadingQuery

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
  graphql<{}, ModelsQuery>(modelsQuery),
  graphql<{}, TopBarLoadingQuery>(loadingMutation)
)(ModelList)
