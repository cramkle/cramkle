import React, { Component } from 'react'

import Deck from './Deck'

export default class DeckList extends Component {
  static defaultProps = {
    loading: true,
  }

  render() {
    const { loading, decks } = this.props

    if (loading) {
      return <p>loading...</p>
    }

    if (decks.length === 0) {
      return (
        <p className="mdc-typography--caption">
          You haven&apos;t created any decks yet
        </p>
      )
    }

    return (
      <div className="mdc-layout-grid">
        <p className="mdc-typography--caption">Decks</p>

        <div className="mdc-layout-grid__inner">
          {decks.map(deck => (
            <div key={deck.deckId} className="mdc-layout-grid__cell">
              <Deck {...deck} />
            </div>
          ))}
        </div>
      </div>
    )
  }
}

