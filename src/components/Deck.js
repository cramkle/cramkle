import React from 'react'
import { withRouter } from 'react-router'
import Card, { CardPrimaryContent } from '@material/react-card'
import { Body2, Headline6 } from '@material/react-typography'

const Deck = ({ title, description, slug, history }) => (
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
