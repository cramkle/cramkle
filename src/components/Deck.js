import React from 'react'
import { withRouter } from 'react-router'
import Card, { CardPrimaryContent } from '@material/react-card'

const Deck = ({ title, description, slug, history }) => (
  <Card outlined className="h-100">
    <CardPrimaryContent
      className="pa2 h-100"
      onClick={() => history.push(`/d/${slug}`)}
    >
      <h3 className="mdc-typography--headline6">{title}</h3>
      <p className="mdc-typography--body2">{description}</p>
    </CardPrimaryContent>
  </Card>
)

Deck.defaultProps = {
  description: null,
}

export default withRouter(Deck)
