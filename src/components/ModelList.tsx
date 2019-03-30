import { Grid } from '@material/react-layout-grid'
import { Caption, Body1 } from '@material/react-typography'
import React, { useEffect } from 'react'
import { compose, graphql, ChildProps } from 'react-apollo'

import ModelCard from './ModelCard'
import { IModel } from '../types/Model'
import modelsQuery from '../graphql/modelsQuery.gql'
import loadingMutation from '../graphql/topBarLoadingMutation.gql'
import logoUrl from '../assets/logo.svg'

interface Data {
  topBar: {
    loading: boolean
  }
  cardModels: IModel[]
}

const ModelList: React.FunctionComponent<ChildProps<{}, Data>> = ({
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
      <div
        className="flex flex-column items-center"
        style={{ marginTop: 'auto', marginBottom: 'auto' }}
      >
        <img width="64" src={logoUrl} alt="" />
        <Body1 className="mt4">You haven&apos;t created any models yet</Body1>
      </div>
    )
  }

  return (
    <Grid className="w-100">
      <Caption>Models</Caption>
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
  graphql<{}, Data>(modelsQuery),
  graphql<{}, Data>(loadingMutation)
)(ModelList)
