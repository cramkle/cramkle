/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateDeckMutation
// ====================================================

export interface CreateDeckMutation_createDeck_studySessionDetails {
  __typename: 'StudySessionDetails'
  newCount: number
  learningCount: number
  reviewCount: number
}

export interface CreateDeckMutation_createDeck {
  __typename: 'Deck'
  /**
   * Deck id
   */
  id: string
  /**
   * Unique identifiable slug
   */
  slug: string
  /**
   * Title of the deck
   */
  title: string
  /**
   * Description of the deck
   */
  description: string | null
  /**
   * Details of current study session
   */
  studySessionDetails: CreateDeckMutation_createDeck_studySessionDetails
}

export interface CreateDeckMutation {
  /**
   * Create a deck entity
   */
  createDeck: CreateDeckMutation_createDeck | null
}

export interface CreateDeckMutationVariables {
  title: string
  description?: string | null
}
