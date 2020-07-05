/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DeckStatistics
// ====================================================

export interface DeckStatistics_deckStatistics_deck {
  __typename: "Deck";
  /**
   * The ID of an object
   */
  id: string;
  /**
   * Title of the deck
   */
  title: string;
}

export interface DeckStatistics_deckStatistics_studyFrequency {
  __typename: "StudyFrequencyPoint";
  date: number;
  learning: number;
  new: number;
}

export interface DeckStatistics_deckStatistics {
  __typename: "DeckStatistics";
  deck: DeckStatistics_deckStatistics_deck;
  /**
   * The total amount of time studied in milliseconds
   */
  totalStudyTime: number;
  /**
   * The number of times the user has studied this deck
   */
  totalTimesStudied: number;
  /**
   * The number of flashcards the user has studied
   */
  totalFlashcardsStudied: number;
  studyFrequency: DeckStatistics_deckStatistics_studyFrequency[];
}

export interface DeckStatistics_decks {
  __typename: "Deck";
  /**
   * The ID of an object
   */
  id: string;
  /**
   * Title of the deck
   */
  title: string;
}

export interface DeckStatistics {
  /**
   * Get the statistics for the given deck.
   */
  deckStatistics: DeckStatistics_deckStatistics | null;
  /**
   * Retrieve all decks for the logged user
   */
  decks: DeckStatistics_decks[];
}

export interface DeckStatisticsVariables {
  deckId?: string | null;
  startDate: string;
  endDate: string;
}
