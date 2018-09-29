import * as React from 'react'
import Card, { CardPrimaryContent } from '@material/react-card'

import { DeckEntity } from '../types'

interface DeckProps extends DeckEntity {}

const Deck: React.StatelessComponent<DeckProps> = ({ title, description }) => (
  <Card outlined>
    <CardPrimaryContent style={{ padding: '.3rem .5rem' }}>
      <h3 className="mdc-typography--headline6">{title}</h3>
      <p className="mdc-typography--body2">{description}</p>
    </CardPrimaryContent>
  </Card>
)

Deck.defaultProps = {
  description: null,
}

export default Deck
