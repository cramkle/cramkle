import Card, { CardPrimaryContent } from '@material/react-card'
import { Headline6 } from '@material/react-typography'
import React from 'react'

import { IModel } from '../types/Model'

interface Props {
  className?: string
}

const ModelCard: React.FunctionComponent<Props & IModel> = ({
  className = '',
  name,
}) => {
  return (
    <Card outlined className={className}>
      <CardPrimaryContent className="pa2">
        <Headline6>{name}</Headline6>
      </CardPrimaryContent>
    </Card>
  )
}

export default ModelCard
