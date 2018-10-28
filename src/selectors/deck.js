import { createSelector } from 'reselect'

const deckStateSelector = state => state.deck

export const getDecks = createSelector(
  deckStateSelector,
  deck => deck.decks
)

export const loadingDecks = createSelector(
  deckStateSelector,
  deck => deck.loading
)

