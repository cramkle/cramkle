import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import Card, { CardPrimaryContent } from '@material/react-card'
import { Body2, Headline6 } from '@material/react-typography'

interface Props extends RouteComponentProps {
  title: string
  description?: string
  slug: string
}

const Deck: React.FunctionComponent<Props> = ({ title, description, slug, history }) => (
  <Card outlined className="h-100">
    <CardPrimaryContent
      className="pa2 h-100"
      onClick={() => history.push(`/d/${slug}`)}
    >
      <Headline6>{title}</Headline6>
      {description && <Body2>{description}</Body2>}
    </CardPrimaryContent>
  </Card>
)

Deck.defaultProps = {
  description: null,
}

export default withRouter(Deck)
