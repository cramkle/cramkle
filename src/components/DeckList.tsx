import * as React from 'react'
import { connect } from 'react-redux'

import Deck from './Deck'
import { DeckEntity } from '../types'
import { fetchDecksRequest } from '../actions/deck'
import { loadingDecks, getDecks } from '../selectors/deck'

interface DeckListProps {
  requestDecks: () => {}
  decks: [DeckEntity]
  loading: boolean
}

class DeckList extends React.Component<DeckListProps> {
  componentDidMount() {
    this.props.requestDecks()
  }

  render() {
    const { loading, decks } = this.props

    if (loading) {
      return <p>loading...</p>
    }

    if (decks.length as number === 0) {
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

const mapStateToProps = state => ({
  decks: getDecks(state),
  loading: loadingDecks(state),
})

const mapDispatchToProps = dispatch => ({
  requestDecks: () => dispatch(fetchDecksRequest()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeckList)
