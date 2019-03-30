import React from 'react'
import { RouteComponentProps } from 'react-router'

const ModelPage: React.FunctionComponent<RouteComponentProps<{ id: string }>> = ({
  match: { params: { id } }
}) => {
  return (
    <>
    </>
  )
}

export default ModelPage
