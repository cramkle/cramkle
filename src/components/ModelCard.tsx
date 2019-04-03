import Card, { CardPrimaryContent } from '@material/react-card'
import { Headline6 } from '@material/react-typography'
import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'

import { IModel } from '../types/Model'

interface Props {
  className?: string
}

const ModelCard: React.FunctionComponent<
  Props & IModel & RouteComponentProps
> = ({ className = '', id, name, history }) => {
  return (
    <Card outlined className={className}>
      <CardPrimaryContent
        className="pa2"
        onClick={() => history.push(`/m/${id}`)}
      >
        <Headline6>{name}</Headline6>
      </CardPrimaryContent>
    </Card>
  )
}

export default withRouter(ModelCard)
