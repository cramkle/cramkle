import React from 'react'
import { Link } from 'react-router-dom'
import Card, { CardPrimaryContent } from '@material/react-card'

const Deck = ({ title, description, slug, history }) => (
  <Card outlined className="h-100">
    <CardPrimaryContent className="pa2 h-100">
      <Link className="link c-on-surface" to={`/d/${slug}`}>
        <h3 className="mdc-typography--headline6">{title}</h3>
        <p className="mdc-typography--body2">{description}</p>
      </Link>
    </CardPrimaryContent>
  </Card>
)

Deck.defaultProps = {
  description: null,
}

export default Deck
