import Card, { CardPrimaryContent } from '@material/react-card'
import { Headline6 } from '@material/react-typography'
import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'

import { ModelsQuery_cardModels } from '../graphql/__generated__/ModelsQuery'

interface Props {
  className?: string
}

const ModelCard: React.FunctionComponent<
  Props & ModelsQuery_cardModels & RouteComponentProps
> = ({ className = '', id, name, history }) => {
  const handleClick = () => history.push(`/m/${id}`)

  return (
    <Card outlined className={className}>
      <CardPrimaryContent
        className="pa2"
        tabIndex={0}
        role="article"
        onClick={handleClick}
        onKeyDown={(e: React.KeyboardEvent) =>
          e.key === 'Enter' && handleClick()
        }
      >
        <Headline6>{name}</Headline6>
      </CardPrimaryContent>
    </Card>
  )
}

export default withRouter(ModelCard)
